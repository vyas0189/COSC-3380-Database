const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { validate, registerPatientSchema } = require('../validation');
// const moment = require('moment');
const db = require('../config/db');

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
	res.send('Hello World');
});
router.post('/register/patient', async (req, res) => {
	try {
		await validate(registerPatientSchema, req.body, req, res);
		const {
			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender,
		} = req.body;

		let { address2 } = req.body;

		const user = await db.query('SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_id WHERE u.username = $1 OR p.patient_email = $2',
			[username, email]);

		if (user.rows.length > 0) {
			return res.status(401).json({ message: 'Username or email is already taken' });
		}

		const hashedPassword = await bcrypt.hashSync(password, 10);

		if (address2 === 'n/a' || address2 === 'N/A') {
			address2 = null;
		}

		const dbUser = await db.query('INSERT INTO db_user(username, password, role) VALUES ($1, $2, $3) RETURNING user_id, username, role',
			[username, hashedPassword, role]);

		const userAddress = await db.query('INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[address, address2, city, state, zip]);

		// res.send({ dbUser: dbUser.rows[0], userAddress: userAddress.rows[0] });

		const userProfile = await db.query('INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_phone_number, patient_gender, patient_address, patient_dob, patient_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
			[firstName, lastName, email, phoneNumber, gender, userAddress.rows[0].address_id, dob, dbUser.rows[0].user_id]);

		res.json(userProfile.rows[0]);
	} catch (err) {
		console.log(err);
	}
});

// router.post('/register/doctor', async (req, res) => {
// 	try {
// 		await validate(registerDoctorSchema, req.body, req, res);
// 		const {
// 			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, primary, specialty, office,
// 		} = req.body;

// 		let { address2 } = req.body;

// 		const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_id WHERE u.username = $1 OR d.doctor_email = $2',
// 			[username, email]);

// 		if (user.rows.length !== 0) {
// 			return res.status(401).json({ message: 'Username or email is already taken' });
// 		}

// 		const hashedPassword = await bcrypt.hashSync(password, 10);

// 		if (address2 === 'n/a' || address2 === 'N/A') {
// 			address2 = null;
// 		}

// 		const dbUser = await db.query('INSERT INTO db_user(username, password, role) VALUES ($1, $2, $3) RETURNING *',
// 			[username, hashedPassword, role]);

// 		const userAddress = await db.query('INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
// 			[address, address2, city, state, zip]);

// 		res.send({ dbUser: dbUser.rows[0], userAddress: userAddress.rows[0] });

// 		const userProfile = await db.query('INSERT INTO doctor(doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_address, doctor_primary, doctor_specialty, doctor_office, doctor_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9',
// 			[firstName, lastName, email, phoneNumber, userAddress.rows[0].address_id, primary, specialty, office, dbUser.rows[0].user_id]);

// 		res.json(userProfile.rows[0]);

// 	} catch (err) {
// 		console.log(err);
// 	}
// });

// router.post('/update/patient', async (req, res) => {
// 	try {
// 		await validate(updatePatientSchema, req.body, req, res);
// 		const {
// 			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender,
// 		} = req.body;

// 		let { address2 } = req.body;

// 		const user = await db.query('SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_id WHERE u.username = $1 OR p.patient_email = $2',
// 			[username, email]);

// 		if (user.rows.length > 0) {
// 			res.json('User found: updating data');
// 		}

// 		if (address2 === 'n/a' || address2 === 'N/A') {
// 			address2 = null;
// 		}





// 		// res.send({ dbUser: dbUser.rows[0], userAddress: userAddress.rows[0] });

// 		const userProfile = await db.query('INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_phone_number, patient_gender, patient_address, patient_dob, patient_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8',
// 			[firstName, lastName, email, phoneNumber, gender, userAddress.rows[0].address_id, dob, dbUser.rows[0].user_id]);

// 		res.json(userProfile.rows[0]);
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

// router.post('/update/doctor', async (req, res) => {
// 	try {
// 		await validate(updateDoctorSchema, req.body, req, res);
// 		const {
// 			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, primary, specialty, office,
// 		} = req.body;

// 		let { address2 } = req.body;

// 		const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_id WHERE u.username = $1 OR d.doctor_email = $2',
// 			[username, email]);

// 		if (user.rows.length !== 0) {
// 			return res.status(401).json({ message: 'Username or email is already taken' });
// 		}

// 		const hashedPassword = await bcrypt.hashSync(password, 10);

// 		if (address2 === 'n/a' || address2 === 'N/A') {
// 			address2 = null;
// 		}

// 		const dbUser = await db.query('INSERT INTO db_user(username, password, role) VALUES ($1, $2, $3) RETURNING *',
// 			[username, hashedPassword, role]);

// 		const userAddress = await db.query('INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
// 			[address, address2, city, state, zip]);

// 		res.send({ dbUser: dbUser.rows[0], userAddress: userAddress.rows[0] });

// 		const userProfile = await db.query('INSERT INTO doctor(doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_address, doctor_primary, doctor_specialty, doctor_office, doctor_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9',
// 			[firstName, lastName, email, phoneNumber, userAddress.rows[0].address_id, primary, specialty, office, dbUser.rows[0].user_id]);

// 		res.json(userProfile.rows[0]);

// 	} catch (err) {
// 		console.log(err);
// 	}
// });

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
