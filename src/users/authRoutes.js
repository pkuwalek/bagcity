const express = require('express');
const {
  prisma,
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
  verifyUser,
  hashPassword,
  authenticateUser,
  verifyRefreshToken,
} = require('./authController');

const router = express.Router();

const findUserById = async (id) => {
  return prisma.users.findUnique({
    where: { user_id: Number(id) },
  });
};
exports.findUserById = findUserById;

router.post('/register', async (req, res) => {
  await prisma.users
    .create({
      data: {
        user_name: req.body.name,
        email: req.body.email,
        password_hash: await hashPassword(req.body.password),
      },
    })
    .then(() => {
      res.status(200).json('User created succesfully.');
    })
    .catch(() => res.status(400).json('Unable to add user.'));
});

router.post('/login', authenticateUser, async (req, res) => {
  const token = getToken({ user_id: req.user.user_id });
  const refreshToken = getRefreshToken({ user_id: req.user.user_id });
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
      const payload = verifyRefreshToken(refreshToken);
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
