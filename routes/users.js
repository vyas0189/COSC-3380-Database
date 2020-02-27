const { Router } = require('express');
const db = require('../config/db');

const router = Router();

router.post('/', async (req, res) => {
  const { id } = req.body;

  try {
    const { rows } = await db.query({ text: 'SELECT * FROM users WHERE id = $1', values: [id] });
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(500).json({ message: 'User Not Found' });
    }
  } catch (err) {
    // console.error(err);
    res.json({ message: 'Please enter a valid ID' });
  }
  // res.send('Hello');
});

router.get('/test', (req, res) => {
  res.send("Hey, how's it going")
});

module.exports = router;
