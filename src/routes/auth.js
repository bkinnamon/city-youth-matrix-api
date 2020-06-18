const express = require('express');
const { auth, getAuthResponse } = require('../auth.js');

const router = express.Router();

router.post('/register', (req, res) => {
  auth.authenticate('register', (error, user) => {
    res.json(getAuthResponse(error, user));
  })(req, res);
});

router.post('/login', (req, res) => {
  auth.authenticate('login', (error, user) => {
    res.json(getAuthResponse(error, user));
  })(req, res);
});

module.exports = router;
