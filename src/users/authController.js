const passport = require('passport');
const LocalStrategy = require('passport-local');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');
const { findUserById } = require('./usersController');

const dev = process.env.NODE_ENV !== 'production';

const prisma = new PrismaClient();

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

const authenticateUser = passport.authenticate('local', { session: false });
exports.authenticateUser = authenticateUser;

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

const verifyUser = passport.authenticate('jwt', { session: false });
exports.verifyUser = verifyUser;

const COOKIE_OPTIONS = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: 1000 * 60 * 60 * 24 * 30,
  sameSite: 'none',
};
exports.COOKIE_OPTIONS = COOKIE_OPTIONS;

const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.SESSION_EXPIRY,
  });
};

exports.getToken = getToken;
const getRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
exports.getRefreshToken = getRefreshToken;

const verifyRefreshToken = (refreshToken) => jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
