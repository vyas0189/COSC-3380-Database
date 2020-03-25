const { Router } = require('express');
// const moment = require('moment');
// const db = require('../config/db');

const router = Router();

router.get('/', async (req, res) => {
	// try {
	// 	const { rows } = await db.query({ text: 'SELECT (doctor_availability) FROM doctor;' });
	// 	if (rows.length > 0) {
	// 		const t = rows[0].doctor_availability.map((d, i) => {
	// 			if (!d.taken) {
	// 				const tem = d.time.split(',')[0].replace('[', '');
	// 				const date = moment(new Date(Date.parse(tem))).utc().format('MM/DD/YYYY');
	// 				const time = moment(new Date(Date.parse(tem))).utc().format('hh:mm:ss A');
	// 				return {
	// 					idx: i + 1, date, time, taken: d.taken,
	// 				};
	// 			}
	// 		});

	// 		res.status(200).json({ t });
	// 	} else {
	// 		res.status(500).json({ message: 'User Not Found' });
	// 	}
	// } catch (err) {
	// 	res.json({ message: 'Please enter a valid ID', err });
	// }
	res.send('Test');
});

router.get('/test', (req, res) => {
	res.send("Hey, how's it going");
});

module.exports = router;
