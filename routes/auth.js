<<<<<<< HEAD
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
	validate, registerPatientSchema, loginPatientSchema, registerDoctorSchema, loginDoctorSchema, up,
} = require('../validation');

// const { login } = require('../auth');
const { auth, admin, doc } = require('../middleware/auth');

const { JWT_SECRET, SESSION_EXPIRES = 60 * 60 } = process.env;
// const moment = require('moment');
const db = require('../config/db');

const router = Router();

router.get('/patient/me', auth, async (req, res) => {
	try {
		const user = await db.query('SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.user_id = $1', [req.user.userID]);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.get('/doctor/me', doc, async (req, res) => {
	try {
		const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_user WHERE u.user_id = $1', [req.user.userID]);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

// router.delete('/delete/patient', admin, async (req, res) => {
// 	try {

// 		const { username } = req.body;

// 		let user = await db.query('SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.username = $1 OR p.patient_email = $2');


// 		res.status(200).json({ message: 'OK'});
// 	} catch (err) {
// 		res.status(500).json({ message: 'Server Error' });
// 	}
// });

router.post('/register/patient', async (req, res) => {
	try {
		await validate(registerPatientSchema, req.body, req, res);
		const {
			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender,
		} = req.body;

		let { address2 } = req.body;

		let user = await db.query('SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.username = $1 OR p.patient_email = $2',
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

		await db.query('INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_phone_number, patient_gender, patient_address, patient_dob, patient_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[firstName, lastName, email, phoneNumber, gender, userAddress.rows[0].address_id, dob, dbUser.rows[0].user_id]);

		user = { userID: dbUser.rows[0].user_id, role: dbUser.rows[0].role };

		const token = jwt.sign(user, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

		res.status(200).json({ message: 'OK', token });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.post('/login/patient', async (req, res) => {
	try {
		await validate(loginPatientSchema, req.body, req, res);
		const { username, password } = req.body;
		const user = await db.query('SELECT * FROM db_user WHERE username = $1', [username]);

		if (user.rows.length === 0) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const validPassword = await bcrypt.compare(password, user.rows[0].password);

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		const currentUser = { userID: user.rows[0].user_id, role: user.rows[0].role };

		const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

		res.status(200).json({ message: 'OK', token });
	} catch (error) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.post('/register/doctor', async (req, res) => {
	try {
		await validate(registerDoctorSchema, req.body, req, res);
		const {
			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, primary, specialty, office,
		} = req.body;

		let { address2 } = req.body;

		const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_id WHERE u.username = $1 OR d.doctor_email = $2',
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
		console.log(dbUser.rows[0]);

		const userAddress = await db.query('INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[address, address2, city, state, zip]);

		await db.query('INSERT INTO doctor(doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_address, doctor_primary, doctor_specialty, doctor_office, doctor_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
			[firstName, lastName, email, phoneNumber, userAddress.rows[0].address_id, primary, specialty, office, dbUser.rows[0].user_id]);

		const currentUser = { userID: dbUser.rows[0].user_id, role: dbUser.rows[0].role };

		const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

		res.status(200).json({ message: 'OK', token });
	} catch (err) {
		res.status(500).json({ message: 'Server Error', err });
	}
});

router.post('/login/doctor', async (req, res) => {
	try {
		await validate(loginDoctorSchema, req.body, req, res);
		const { username, password } = req.body;
		const user = await db.query('SELECT * FROM db_user WHERE username = $1', [username]);

		if (user.rows.length === 0) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const validPassword = await bcrypt.compare(password, user.rows[0].password);

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		const currentUser = { userID: user.rows[0].user_id, role: user.rows[0].role };

		const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });
		res.status(200).json({ message: 'OK', token });

		
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

module.exports = router;
=======
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
	validate, registerPatientSchema, loginPatientSchema, registerDoctorSchema, loginDoctorSchema,
} = require('../validation');
const { auth, doc } = require('../middleware/auth');

const { JWT_SECRET, SESSION_EXPIRES = 60 * 60 } = process.env;
// const moment = require('moment');
const db = require('../config/db');

const router = Router();

router.get('/patient/me', auth, async (req, res) => {
	try {
		const user = await db.query('SELECT * FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.user_id = $1', [req.user.userID]);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.get('/doctor/me', doc, async (req, res) => {
	try {
		const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_user WHERE u.user_id = $1', [req.user.userID]);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.post('/register/patient', async (req, res) => {
	try {
		await validate(registerPatientSchema, req.body, req, res);
		const {
			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender,
		} = req.body;

		let { address2 } = req.body;

		let user = await db.query('SELECT user_id FROM db_user u JOIN patient p ON u.user_id = p.patient_user WHERE u.username = $1 OR p.patient_email = $2',
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

		await db.query('INSERT INTO patient(patient_first_name, patient_last_name, patient_email, patient_phone_number, patient_gender, patient_address, patient_dob, patient_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[firstName, lastName, email, phoneNumber, gender, userAddress.rows[0].address_id, dob, dbUser.rows[0].user_id]);

		user = { userID: dbUser.rows[0].user_id, role: dbUser.rows[0].role };

		const token = jwt.sign(user, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

		res.status(200).json({ message: 'OK', token });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.post('/login/patient', async (req, res) => {
	try {
		await validate(loginPatientSchema, req.body, req, res);
		const { username, password } = req.body;
		const user = await db.query('SELECT * FROM db_user WHERE username = $1', [username]);

		if (user.rows.length === 0) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		const validPassword = await bcrypt.compare(password, user.rows[0].password);

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		const currentUser = { userID: user.rows[0].user_id, role: user.rows[0].role };

		const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });
		console.log(token);

		res.status(200).json({ message: 'OK', token });
	} catch (error) {
		res.status(500).json({ message: 'Server Error' });
	}
});


router.post('/register/doctor', async (req, res) => {
	try {
		await validate(registerDoctorSchema, req.body, req, res);
		const {
			username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, primary, specialty, office,
		} = req.body;

		let { address2 } = req.body;

		const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_id WHERE u.username = $1 OR d.doctor_email = $2',
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
		console.log(dbUser.rows[0]);

		const userAddress = await db.query('INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[address, address2, city, state, zip]);

		await db.query('INSERT INTO doctor(doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_address, doctor_primary, doctor_specialty, doctor_office, doctor_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
			[firstName, lastName, email, phoneNumber, userAddress.rows[0].address_id, primary, specialty, office, dbUser.rows[0].user_id]);

		const currentUser = { userID: dbUser.rows[0].user_id, role: dbUser.rows[0].role };

		const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

		res.status(200).json({ message: 'OK', token });
	} catch (err) {
		res.status(500).json({ message: 'Server Error', err });
	}
});

router.post('/login/doctor', async (req, res) => {
	try {
		await validate(loginDoctorSchema, req.body, req, res);
		const { username, password } = req.body;
		const user = await db.query('SELECT * FROM db_user WHERE username = $1', [username]);

		if (user.rows.length === 0) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		const validPassword = await bcrypt.compare(password, user.rows[0].password);

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}
		const currentUser = { userID: user.rows[0].user_id, role: user.rows[0].role };

		const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });
		res.status(200).json({ message: 'OK', token });
	} catch (err) {
		res.status(500).json({ message: 'Server Error' });
	}
});


module.exports = router;
>>>>>>> d910d279aa3f87803e6135d0dc43bad41ffcf74d
