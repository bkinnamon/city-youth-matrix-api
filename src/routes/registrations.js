const express = require('express');
const auth = require('../auth.js');
const errors = require('../errors.js');
const Registrations = require('../registrations.js');

const router = express.Router();

router.post('/', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) res.status(errors.unauthorized.status).json({ error });
    else if (!user) res.status(errors.unauthorized.status).json({ error });
    else {
      const [registration, err] = await Registrations.create(req.body);
      if (err) res.status(err.status).json({ error: err.message });
      else res.json({ registration });
    }
  })(req, res);
});

router.get('/', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) res.status(errors.unauthorized.status).json({ error });
    else if (!user) res.status(errors.unauthorized.status).json({ error });
    else {
      const [registrations, err] = await Registrations.getAll();
      if (err) res.status(err.status).json({ error: err.message });
      else res.json({ registrations });
    }
  })(req, res);
});

router.get('/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) res.status(errors.unauthorized.status).json({ error });
    else if (!user) {
      res.status(errors.unauthorized.status).json({ error: errors.unauthorized.message });
    } else {
      const [registration, err] = await Registrations.get(req.params.id);
      if (err) res.status(err.status).json({ error: err.message });
      else res.json({ registration });
    }
  })(req, res);
});

router.put('/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) res.status(errors.unauthorized.status).json({ error });
    else if (!user) {
      res.status(errors.unauthorized.status).json({ error: errors.unauthorized.message });
    } else {
      const [registration, err] = await Registrations.update(req.params.id, req.body);
      if (err) res.status(err.status).json({ error: err.message });
      else res.json({ registration });
    }
  })(req, res);
});

router.delete('/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) res.status(errors.unauthorized.status).json({ error });
    else if (!user) {
      res.status(errors.unauthorized.status).json({ error: errors.unauthorized.message });
    } else {
      await Registrations.destroy(req.params.id);
      res.json({ deleted: req.params.id });
    }
  })(req, res);
});

module.exports = router;
