const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

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

passport.serializeUser((user, done) => {
  done(null, user.user_id); // Faktycznie zaczeło działać po zmianie z id na user_id.
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { user_id: Number(id) } });
  if (!user) return done('No user to deserialize');

  return done(null, user);
});

router.post('/register', async (req, res) => {
  await prisma.users
    .create({
      data: {
        user_name: req.body.name,
        email: req.body.email,
        password_hash: await argon2.hash(req.body.password),
      },
    })
    .then((user) => {
      res.status(200).json('User created succesfully.');
      // coś innego na frontend wysłać, np.okejkę, a po loginie ciasteczko
    })
    .catch(() => res.status(400).json('Unable to add user.'));
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', successRedirect: '/bags' }));

module.exports = router;
