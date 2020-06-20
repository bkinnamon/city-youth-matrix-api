const express = require('express');
const cors = require('cors');
const { auth } = require('./src/auth.js');

const userRoutes = require('./src/routes/users.js');
const eventRoutes = require('./src/routes/events.js');
const regRoutes = require('./src/routes/registrations.js');

const PORT = 3000;


const app = express();
app.use(cors());
app.use(express.json());
app.use(auth.initialize());

app.use('/', userRoutes);
app.use('/events', eventRoutes);
app.use('/registrations', regRoutes);

app.post('/echo', (req, res) => {
  res.json(req.body);
});

app.listen(PORT);
