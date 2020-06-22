const express = require('express');
const { auth, getAuthResponse } = require('../auth.js');
const Users = require('../user.js');

const router = express.Router();

router.post('/register', (req, res) => {
  auth.authenticate('register', (error, user) => {
    res.json(getAuthResponse(error, user));
  })(req, res);
});

router.post('/login', (req, res) => {
  // const token = ExtractJWT.fromAuthHeaderAsBearerToken()(req);
  auth.authenticate('jwt', (error, user) => {
    if (error) {
      auth.authenticate('login', (err, u) => {
        res.json(getAuthResponse(err, u));
      })(req, res);
    } else {
      res.json(getAuthResponse(error, user));
    }
  })(req, res);
});

router.get('/users', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (!user.type || !user.type.includes('dispatcher')) {
      res.status(401).json({ error: 'Not authorized' });
    }
    const [users, err] = await Users.getAll();
    if (err) res.status(500).json({ error: err });
    res.json({ users });
  })(req, res);
});

router.get('/users/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    const { id } = req.params;
    if (id !== user.id
      || !user.type
      || !user.type.includes('dispatcher')
    ) {
      res.status(401).json({ error: 'Not authorized' });
    }
    const [userData, err] = await Users.get(req.params.id);
    if (err) res.status(404).json({ error: err });
    res.json({ user: userData });
  })(req, res);
});

router.put('/users/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    const { id } = req.params;
    if (id !== user.id
      || !user.type
      || !user.type.includes('dispatcher')
    ) {
      res.status(401).json({ error: 'Not authorized' });
    }
    const [userData, err] = await Users.update(req.params.id, req.body);
    if (err) res.status(404).json({ error: err });
    res.json({ user: userData });
  })(req, res);
});

router.delete('/users/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    const { id } = req.params;
    if (id !== user.id
      || !user.type
      || !user.type.includes('dispatcher')
    ) {
      res.status(401).json({ error: 'Not authorized' });
    }
    await Users.delete(req.params.id);
    res.json({ deleted: req.params.id });
  })(req, res);
});

module.exports = router;
