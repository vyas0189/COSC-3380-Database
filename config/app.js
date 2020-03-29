require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { join } = require('path');
// const rateLimit = require('express-rate-limit');
const db = require('./db');
const auth = require('../routes/auth');

db.connect()
  .then(() => { console.log('Database connected!'); })
  .catch(async (err) => {
    console.log(err);
    await db.end();
  });

const app = express();

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 15,
//   message:
//     { message: 'Too many accounts created from this IP, please try again after an hour' },
// });

app.use(compression());
app.use(helmet());
app.use(morgan('common'));
// app.use(limiter);

const isProduction = process.env.NODE_ENV === 'production';
const origin = {
  origin: isProduction ? 'https://www.example.com' : '*',
};

app.use(cors(origin));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/api');
});
app.use('/auth', auth);

if (isProduction) {
  app.use(express.static(join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build', 'index.html'));
  });
}

module.exports = app;
