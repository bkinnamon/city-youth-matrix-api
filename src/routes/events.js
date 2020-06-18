const express = require('express');
const { auth } = require('../auth.js');
const Event = require('../event.js');

const router = express.Router();

// const events = [
// {
// name: 'Lorem Ipsum Dolor',
// partner: 'YMCA of Frederick County',
// start: new Date(2020, 5, 29, 15).valueOf(),
// end: new Date(2020, 5, 29, 16, 30).valueOf(),
// },
// {
// name: 'Praesent Non Nisi Quam',
// partner: 'Id Faucibus Mi',
// start: new Date(2020, 5, 30, 17, 45).valueOf(),
// end: new Date(2020, 5, 29, 20).valueOf(),
// },
// {
// name: 'Sed Semper',
// partner: 'Nunc Non Libero, Donec Lacinia',
// start: new Date(2020, 6, 2, 16).valueOf(),
// end: new Date(2020, 6, 2, 18).valueOf(),
// },
// {
// name: 'Justo Sit Amet Eleifend',
// partner: 'Tristique At Ultricies Eget',
// start: new Date(2020, 6, 2, 13, 30).valueOf(),
// end: new Date(2020, 6, 2, 15, 30).valueOf(),
// },
// {
// name: 'Lacina Arcu Sapien',
// partner: 'Nullam Auctor',
// start: new Date(2020, 6, 6, 15, 15).valueOf(),
// end: new Date(2020, 6, 6, 16, 15).valueOf(),
// },
// ];

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
    if (!user) {
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

module.exports = router;
