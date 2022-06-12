/* eslint-disable no-console */
/* eslint-disable camelcase */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bags = require('./src/bags/bags');
const users = require('./src/users/users');
const auth = require('./src/users/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

app.use('/bags', bags);
app.use('/users', users);
app.use('/auth', auth);

app.listen(3000, () => console.log('Server is ready - localhost:3000'));
