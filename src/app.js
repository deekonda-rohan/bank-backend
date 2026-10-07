const express = require('express');
const authRouter = require('./routes/auth.route.js');

app.use(express.json());

const app = express();

module.exports = app;