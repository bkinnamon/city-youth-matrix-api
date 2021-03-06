const express = require('express');
const { auth } = require('../auth.js');
const Event = require('../event.js');

const router = express.Router();

// Get event list
router.get('/', async (req, res) => {
  const [events, err] = await Event.getAll();
  if (err) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  res.json({ events });
});

// Get a specific event
router.get('/:id', async (req, res) => {
  const [event, err] = await Event.get(req.params.id);
  if (err) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  res.json({ event });
});

// Create a new event
router.post('/', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) {
      res.status(401).json({ error });
      return;
    }
    if (!user || !user.types.includes('dispatcher')) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const [event, err] = await Event.create(req.body);
    if (err) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    res.json({ event });
  })(req, res);
});

// Update an event
router.put('/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) {
      res.status(401).json({ error });
      return;
    }
    if (!user || !user.types.includes('dispatcher')) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const [event, err] = await Event.update(req.params.id, req.body);
    if (err) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    res.json({ event });
  })(req, res);
});

// Registration update from a driver
router.patch('/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) {
      res.status(401).json({ error });
      return;
    }
    if (!user || !user.types.includes('dispatcher')) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }
    if (!Array.isArray(req.body.registrations)) {
      res.status(401).json({ error: 'registrations must be an array' });
      return;
    }

    const [event, err] = await Event.setRegList(req.params.id, req.body.registrations);
    if (err) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    res.json({ event });
  })(req, res);
});

// Delete an event
router.delete('/:id', (req, res) => {
  auth.authenticate('jwt', async (error, user) => {
    if (error) {
      res.status(401).json({ error });
      return;
    }
    if (!user || !user.types.includes('dispatcher')) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const err = await Event.destroy(req.params.id);
    if (err) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    res.json({ deleted: req.params.id });
  })(req, res);
});

module.exports = router;
