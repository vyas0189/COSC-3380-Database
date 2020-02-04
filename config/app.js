require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db');

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();

app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/api', (req, res) => {
  res.send({ msg: 'Hello World! 👋' });
});

module.exports = app;
