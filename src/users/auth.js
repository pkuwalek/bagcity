const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';

const prisma = new PrismaClient();
const router = express.Router();

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await prisma.users.findUnique({ where: { email } });
    const response = 'Invalid login credentials';

    if (!user) return done(response);
    if (user) {
      const passwordMatch = await argon2.verify(user.password_hash, password); // argon2 ma rację hash jest niepoprawny, ponieważ dostaje ciąg z wieloma znakami pustymi na końcu.
      if (passwordMatch) return done(null, user);
      return done(response);
    }
  })
);

const findUserById = async (id) => {
  return prisma.users.findUnique({
    where: { user_id: Number(id) },
  });
};

// zwraca user_id
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  const user = await findUserById(id);
  if (!user) return done('No user to deserialize');

  return done(null, user);
});

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    // Check against the DB only if necessary.
    const user = await findUserById(jwt_payload.user_id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
    // or you could create a new account
  })
);

const COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: 'none',
};

const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  });
};

const getRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  });
};

const verifyUser = passport.authenticate('jwt', { session: false });

router.post('/register', async (req, res) => {
  await prisma.users
    .create({
      data: {
        user_name: req.body.name,
        email: req.body.email,
        password_hash: await argon2.hash(req.body.password),
      },
    })
    .then(() => {
      res.status(200).json('User created succesfully.');
    })
    .catch(() => res.status(400).json('Unable to add user.'));
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
  const token = getToken({ user_id: req.user.user_id });
  const refreshToken = getRefreshToken({ user_id: req.user.user_id });
  const user = await findUserById(req.user.user_id);
  await prisma.users
    .update({
      where: { user_id: Number(req.user.user_id) },
      data: { refresh_token: { push: refreshToken } },
    })
    .then(() => {
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token });
    })
    .catch((err) => res.status(400).send(err));
});

router.post('/refreshToken', async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const { user_id } = payload;
      findUserById(user_id).then(
        (user) => {
          if (user) {
            // Find the refresh token against the user record in database
            const tokenIndex = user.refresh_token.findIndex((item) => item === refreshToken);
            if (tokenIndex === -1) {
              res.statusCode = 401;
              res.send('Unauthorized - no token found');
            } else {
              const token = getToken({ user_id });
              // If the refresh token exists, then create new one and replace it.
              const refreshedTokens = user.refresh_token;
              refreshedTokens[tokenIndex] = getRefreshToken({ user_id });
              prisma.users
                .update({
                  where: { user_id: Number(user_id) },
                  data: { refresh_token: { set: refreshedTokens } },
                })
                .then(() => {
                  res.cookie('refreshToken', refreshedTokens[tokenIndex], COOKIE_OPTIONS);
                  res.send({ success: true, token });
                })
                .catch((err) => {
                  res.statusCode = 500;
                  res.send(err);
                });
            }
          } else {
            res.statusCode = 401;
            res.send('Unauthorized - no user found');
          }
        },
        (err) => next(err)
      );
    } catch (err) {
      res.statusCode = 401;
      res.send('Unauthorized - code error');
    }
  } else {
    res.statusCode = 401;
    res.send('Unauthorized - no cookie');
  }
});

router.get('/logout', verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  findUserById(req.user.user_id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.clearCookie('refreshToken', COOKIE_OPTIONS);
          res.send({ success: true });
        }
      });
    },
    (err) => next(err)
  );
});

module.exports = router;
