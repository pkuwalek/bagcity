const express = require('express');
const { pushNewRefreshToken, setRefreshedTokens, createUser, getUsersRefreshToken } = require('./usersController');
const {
  getToken,
  getRefreshToken,
  COOKIE_OPTIONS,
  verifyUser,
  authenticateUser,
  verifyRefreshToken,
} = require('./authController');

const router = express.Router();

router.post('/register', async (req, res) => {
  createUser(req.body)
    .then((success) => {
      if (success) {
        res.status(200).json('User created succesfully.');
      } else {
        res.status(409).json('User not added.');
      }
    })
    .catch(() => res.status(500).json('Unable to add user.'));
});

router.post('/login', authenticateUser, async (req, res) => {
  const token = getToken({ user_id: req.user.user_id });
  const refreshToken = getRefreshToken({ user_id: req.user.user_id });
  pushNewRefreshToken(req.user.user_id, refreshToken)
    .then((success) => {
      if (success) {
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
      } else {
        res.status(500).send('Unable to push new refresh token.');
      }
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.post('/refreshToken', async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const { user_id } = payload;
      getUsersRefreshToken(user_id).then(
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
              setRefreshedTokens(user_id, refreshedTokens)
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
  getUsersRefreshToken(req.user.user_id).then(
    (user) => {
      const tokenIndex = user.refresh_token.findIndex((item) => item === refreshToken);

      if (tokenIndex !== -1) {
        const leftoverTokens = user.refresh_token.filter((token) => token !== refreshToken);
        setRefreshedTokens(req.user.user_id, leftoverTokens)
          .then((success) => {
            if (success) {
              res.clearCookie('refreshToken', COOKIE_OPTIONS);
              res.send({ success: true });
            } else {
              res.statusCode = 500;
              res.send('Saving refreshed tokens failed');
            }
          })
          .catch((err) => {
            res.statusCode = 500;
            res.send(err);
          });
      } else {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        res.status(500).send('Token not found.');
      }
    },
    (err) => next(err)
  );
});

router.get('/me', verifyUser, (req, res) => {
  res.send(req.user);
});

module.exports = router;
