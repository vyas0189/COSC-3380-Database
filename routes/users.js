const { Router } = require('express');
const bcrypt = require('bcryptjs');

// const moment = require('moment');
const db = require('../config/db');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query({ text: 'SELECT (doctor_availability) FROM doctor;' });
    if (rows.length > 0) {
      const t = rows[0].doctor_availability.map((d, i) => {
        if (!d.taken) {
          const tem = d.time.split(',')[0].replace('[', '');
          const date = moment(new Date(Date.parse(tem))).utc().format('MM/DD/YYYY');
          const time = moment(new Date(Date.parse(tem))).utc().format('hh:mm:ss A');
          return {
            idx: i + 1, date, time, taken: d.taken,
          };
        }
      });

      res.status(200).json({ t });
    } else {
      res.status(500).json({ message: 'User Not Found' });
    }
  } catch (err) {
        res.json({ message: 'Please enter a valid ID', err });
  }  
});

router.post('/fakeUser', async (req, res) => {
	const { username, password, role } = req.body;
	const query = 'SELECT * FROM db_user WHERE username = $1';
	const values = [username];
	try {
		const { rows } = await db.query(query, values);
		if (rows.length > 0) {
			return res.status(500).json({ message: 'Username already exists' });
		}
		const hasPassword = await bcrypt.hash(password, 10);
		const insertQuey = 'INSERT INTO db_user (username, password, role, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
		const insertValues = [username, hasPassword, role];

		const insertResult = await db.query(insertQuey, insertValues);
		return res.status(200).json(insertResult.command);
	} catch (err) {
		return res.status(500).json(err.message);
	}
});

module.exports = router;
