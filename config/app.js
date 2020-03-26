require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { join } = require('path');
// const rateLimit = require('express-rate-limit');
// const session = require('express-session');
// const PGSession = require('connect-pg-simple')(session);
const db = require('./db');
const user = require('../routes/users')

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

// app.use(session(
//   {
//     store: new PGSession({
//       pool: db,
//       tableName: 'session',
//     }),
//     secret: 'test',
//     resave: true,
//     cookie: { secure: false, maxAge: 60 * 60 * 1000 },
//     saveUninitialized: true,
//   },
// ));

const isProduction = process.env.NODE_ENV === 'production';
const origin = {
  origin: isProduction ? 'https://www.example.com' : '*',
};

app.use(cors(origin));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/api');
});

app.get('/api', (req, res) => {
  res.status(200).json({ msg: 'Welcome to the Medical Clinic API!' });
});

app.use('/user', user)

app.get('/test', (req, res) => {
  req.session.user = { user: 'username' };
  res.send({ user: 'username' });
});



if (isProduction) {
  app.use(express.static(join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build', 'index.html'));
  });
}

app.use('/api/users', require('../routes/users'));

module.exports = app;
