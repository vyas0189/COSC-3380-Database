const { Router } = require('express');
const db = require('../config/db');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    console.table(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
