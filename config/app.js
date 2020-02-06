require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db');

db.connect()
  .then(() => { console.log('Database connected!'); })
  .catch((err) => { console.log(err); });

const app = express();

app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/api', (req, res) => {
  res.send({ msg: 'Hello World! 👋' });
});

app.use('/api/users', require('../routes/users'));

module.exports = app;
