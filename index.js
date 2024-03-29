/* eslint-disable no-console */
/* eslint-disable camelcase */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bags = require('./src/bags/bags');
const users = require('./src/users/usersRoutes');
const auth = require('./src/users/authRoutes');
const { verifyUser } = require('./src/users/authController');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  // Load environment variables from .env file in non prod environments
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/bags', bags);
app.use('/users', verifyUser, users);
app.use('/auth', auth);

app.listen(3000, () => console.log('Server is ready - localhost:3000'));
