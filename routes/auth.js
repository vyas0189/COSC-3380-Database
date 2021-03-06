const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerPatient, loginPatient, loginDoctor } = require('../validation');
const { auth, doc } = require('../middleware/auth');

const { JWT_SECRET, SESSION_EXPIRES = 60 * 60 } = process.env;
const db = require('../config/db');

const router = Router();

router.get('/patient/me', auth, async (req, res) => {
	try {
		const user = await db.query(
			'SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.user_id = $1',
			[req.user.userID],
		);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/doctor/me', doc, async (req, res) => {
	try {
		const user = await db.query(
			'SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_user WHERE u.user_id = $1',
			[req.user.userID],
		);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/register/patient', async (req, res) => {
	try {
		await registerPatient.validateAsync(req.body, { abortEarly: false });
		const {
			username,
			password,
			role,
			firstName,
			lastName,
			email,
			address,
			city,
			state,
			zip,
			phoneNumber,
			dob,
			gender,
		} = req.body;

		let { address2 } = req.body;

		let user = await db.query(
			'SELECT user_id FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.username = $1 OR p.patient_email = $2',
			[username, email],
		);

		if (user.rows.length > 0) {
			return res
				.status(401)
				.json({ message: 'Username or email is already taken' });
		}

		const hashedPassword = await bcrypt.hashSync(password, 10);

		if (address2 === 'n/a' || address2 === 'N/A') {
			address2 = null;
		}

		const dbUser = await db.query(
			'INSERT INTO db_user(username, password, role) VALUES ($1, $2, $3) RETURNING user_id, username, role',
			[username, hashedPassword, role],
		);

		const userAddress = await db.query(
			'INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[address, address2, city, state, zip],
		);

		await db.query(
			'INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_phone_number, patient_gender, patient_address, patient_dob, patient_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[
				firstName,
				lastName,
				email,
				phoneNumber,
				gender,
				userAddress.rows[0].address_id,
				dob,
				dbUser.rows[0].user_id,
			],
		);

		user = { userID: dbUser.rows[0].user_id, role: dbUser.rows[0].role };

		const token = jwt.sign(user, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

		return res.status(200).json({ message: 'OK', token });
	} catch (error) {
		res.status(500).json({ message: 'Enter the right Information', error });
	}
});

router.post('/login/patient', async (req, res) => {
	try {
		await loginPatient.validateAsync(req.body, { abortEarly: false });
		const { username, password } = req.body;
		const user = await db.query('SELECT * FROM db_user WHERE username = $1', [
			username,
		]);

		if (user.rows.length === 0) {
			return res
				.status(401)
				.json({ message: 'Invalid username or password' });
		}
		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].password,
		);

		if (!validPassword) {
			return res
				.status(401)
				.json({ message: 'Invalid username or password' });
		}
		const currentUser = {
			userID: user.rows[0].user_id,
			role: user.rows[0].role,
		};


		if (user.rows[0].role === 'patient') {
			const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });
			return res.status(200).json({ message: 'OK', token });
		}

		res.status(500).json({ message: 'Enter the valid Username or Password' });
	} catch (error) {
		res.status(500).json({ message: 'Invalid username or password.', error });
	}
});

router.post('/login/doctor', async (req, res) => {
	try {
		await loginDoctor.validateAsync(req.body, { abortEarly: false });
		const { username, password } = req.body;
		const user = await db.query('SELECT * FROM db_user WHERE username = $1', [
			username,
		]);

		if (user.rows.length === 0) {
			return res
				.status(401)
				.json({ message: 'Invalid username or password' });
		}

		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].password,
		);

		if (!validPassword) {
			return res
				.status(401)
				.json({ message: 'Invalid username or password' });
		}


		const currentUser = { userID: user.rows[0].user_id, role: user.rows[0].role };
		if (user.rows[0].role === 'doctor') {
			const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });
			return res.status(200).json({ message: 'OK', token });
		}
		res.status(500).json({ message: 'Enter the valid Username or Password' });
	} catch (error) {
		res.status(500).json({ message: 'Invalid username or password.', error });
	}
});

module.exports = router;
