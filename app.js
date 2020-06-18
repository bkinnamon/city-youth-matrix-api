const express = require('express');
const { auth } = require('./src/auth.js');

const authRoutes = require('./src/routes/auth.js');
const eventRoutes = require('./src/routes/events.js');

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(auth.initialize());

app.use('/', authRoutes);
app.use('/events', eventRoutes);

app.post('/echo', (req, res) => {
  res.json(req.body);
});

app.listen(PORT);
