const express = require('express');
const { auth, getAuthResponse } = require('./src/auth.js');

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(auth.initialize());

app.post('/echo', (req, res) => {
  res.json(req.body);
});

app.post('/register', (req, res) => {
  auth.authenticate('register', (error, user) => {
    res.json(getAuthResponse(error, user));
  })(req, res);
});

app.post('/login', (req, res) => {
  auth.authenticate('login', (error, user) => {
    res.json(getAuthResponse(error, user));
  })(req, res);
});

app.listen(PORT);
