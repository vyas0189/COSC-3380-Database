const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
	loginAdmin,
	registerDoctor,
	registerOffice,
	updateDoctorAdmin,
	cancelAppointmentAdmin,
	registerAdmin,
	generateReport,
} = require('../validation');
const { admin } = require('../middleware/auth');

const { JWT_SECRET, SESSION_EXPIRES = 60 * 60 } = process.env;
const db = require('../config/db');

const router = Router();

router.get('/me', admin, async (req, res) => {
	try {
		const user = await db.query('SELECT * FROM db_user WHERE user_id = $1', [
			req.user.userID,
		]);
		if (user.rows.length > 0) {
			return res.status(200).json({ message: 'OK', user: user.rows[0] });
		}
		return res.status(401).json({ message: 'User not found' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/create/admin', async (req, res) => {
	try {
		await registerAdmin.validateAsync(req.body, { abortEarly: false });

		const { username, password, role } = req.body;

		const hashedPassword = await bcrypt.hashSync(password, 10);

		const dbUser = await db.query(
			'INSERT INTO db_user(username, password, role) VALUES ($1, $2, $3) RETURNING user_id, username, role',
			[username, hashedPassword, role]
		);

		const currentUser = {
			userID: dbUser.rows[0].user_id,
			role: dbUser.rows[0].role,
		};

		const token = jwt.sign(currentUser, JWT_SECRET, {
			expiresIn: SESSION_EXPIRES,
		});

		res.status(200).json({ message: 'OK', token });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/login', async (req, res) => {
	try {
		await loginAdmin.validateAsync(req.body, { abortEarly: false });
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
			user.rows[0].password
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

		const token = jwt.sign(currentUser, JWT_SECRET, {
			expiresIn: SESSION_EXPIRES,
		});

		res.status(200).json({ message: 'OK', token });
	} catch (error) {
		res.status(500).json({ message: 'Server Error' });
	}
});

router.post('/register/doctor', admin, async (req, res) => {
	try {
		await registerDoctor.validateAsync(req.body, { abortEarly: false });
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
			primary,
			specialty,
			office,
		} = req.body;

		let { address2 } = req.body;

		const user = await db.query(
			'SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_id WHERE u.username = $1 OR d.doctor_email = $2',
			[username, email]
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
			[username, hashedPassword, role]
		);

		const userAddress = await db.query(
			'INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[address, address2, city, state, zip]
		);

		await db.query(
			'INSERT INTO doctor(doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_address, doctor_primary, doctor_specialty, doctor_office, doctor_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
			[
				firstName,
				lastName,
				email,
				phoneNumber,
				userAddress.rows[0].address_id,
				primary,
				specialty,
				office,
				dbUser.rows[0].user_id,
			]
		);

		const currentUser = {
			userID: dbUser.rows[0].user_id,
			role: dbUser.rows[0].role,
		};

		const token = jwt.sign(currentUser, JWT_SECRET, {
			expiresIn: SESSION_EXPIRES,
		});

		res.status(200).json({ message: 'OK', token });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/register/office', admin, async (req, res) => {
	try {
		await registerOffice.validateAsync(req.body, { abortEarly: false });
		const { capacity, address, city, state, zip, phoneNumber } = req.body;

		let { address2 } = req.body;

		const alreadyExists = await db.query(
			'SELECT * FROM office WHERE office_phone_number = $1',
			[phoneNumber]
		);

		if (alreadyExists.rows.length > 0) {
			return res
				.status(401)
				.json({ message: 'That office already exists.' });
		}

		if (address2 === 'n/a' || address2 === 'N/A') {
			address2 = null;
		}

		const officeAddress = await db.query(
			'INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
			[address, address2, city, state, zip]
		);

		await db.query(
			'INSERT INTO office(office_capacity, office_address, office_phone_number) VALUES($1, $2, $3)',
			[capacity, officeAddress.rows[0].address_id, phoneNumber]
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/get/offices', admin, async (req, res) => {
	try {
		const offices = await db.query(
			'SELECT * FROM address INNER JOIN office ON (address.address_id = office.office_address)'
		);

		res.status(200).json({
			message: 'OK',
			offices: offices.rows,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/get/doctors', admin, async (req, res) => {
	try {
		const doctors = await db.query('SELECT * FROM doctor');

		res.status(200).json({
			message: 'OK',
			doctors: doctors.rows,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.put('/update/doctor', admin, async (req, res) => {
	try {
		await updateDoctorAdmin.validateAsync(req.body, { abortEarly: false });
		const { doctorID, primary, specialty, office } = req.body;

		const doctor = await db.query(
			'SELECT * FROM doctor WHERE doctor_id = $1',
			[doctorID]
		);

		if (doctor.rows.length === 0) {
			return res.status(401).json({ message: 'Doctor not found.' });
		}

		await db.query(
			'UPDATE doctor SET doctor_primary = $1, doctor_specialty = $2, doctor_office = $3 WHERE doctor_id = $4',
			[primary, specialty, office, doctorID]
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.delete('/cancel', admin, async (req, res) => {
	try {
		await cancelAppointmentAdmin.validateAsync(req.body, {
			abortEarly: false,
		});
		const { patientID, appointmentID } = req.body;

		const appointment = await db.query(
			'SELECT * FROM appointment WHERE appointment_id = $1 AND appointment_patient = $2',
			[appointmentID, patientID]
		);

		if (appointment.rows.length === 0) {
			return res.status(401).json({
				message: 'You do not have an appointment scheduled then.',
			});
		}

		// setting taken condition to false
		await db.query(
			'UPDATE availability SET availability_taken = FALSE WHERE availability_id = $1',
			[appointment.rows[0].appointment_availability]
		);

		await db.query(
			'DELETE FROM appointment WHERE appointment_id = $1 AND appointment_patient = $2',
			[appointmentID, patientID]
		);

		res.status(200).json({ message: 'OK - appointment deleted' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/get/patients/:startDate/:endDate', admin, async (req, res) => {
	try {
		// console.log(req.params);

		await generateReport.validateAsync(req.params, { abortEarly: false });
		const { startDate, endDate } = req.params;

		const patients = await db.query(
			"SELECT username, role, created_at,	updated_at,	patient_id,	patient_first_name,	patient_last_name, patient_email, patient_phone_number, patient_gender, patient_address, patient_dob, date_part('year', age(patient_dob)) AS age FROM db_user JOIN patient ON user_id = patient_user WHERE role = 'patient' AND created_at::date >= $1 AND created_at::date <= $2;",
			[startDate, endDate]
		);

		const avgAge = await db.query(
			"SELECT AVG(date_part('year', age(patient_dob))) as avg_age FROM patient JOIN db_user ON user_id = patient_user WHERE role = 'patient' AND created_at::date >= $1 AND created_at::date <= $2 GROUP BY role;",
			[startDate, endDate]
		);

		const stateCounts = await db.query(
			"SELECT state, COUNT(state) FROM patient JOIN db_user ON user_id = patient_user JOIN address ON patient.patient_address = address.address_id WHERE role = 'patient' AND created_at::date >= $1 AND created_at::date <= $2 GROUP BY state ORDER BY COUNT(state) DESC;",
			[startDate, endDate]
		);

		res.status(200).json({
			message: 'OK',
			avgAge: avgAge.rows,
			stateCounts: stateCounts.rows,
			patients: patients.rows,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/get/appointments/:startDate/:endDate', admin, async (req, res) => {
	try {
		// console.log(req.params);

		await generateReport.validateAsync(req.params, { abortEarly: false });
		const { startDate, endDate } = req.params;

		const doctors = await db.query(
			"SELECT username, role, created_at, doctor_id, doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_specialty FROM doctor JOIN db_user ON db_user.user_id = doctor.doctor_user WHERE role = 'doctor';"
		);

		const doctorAppts = await db.query(
			'SELECT COUNT(availability_taken) AS count, doctor_first_name, doctor_last_name FROM availability JOIN doctor ON availability.doctor_id = doctor.doctor_id WHERE availability_taken IS TRUE AND availability_date::date >= $1 AND availability_date::date <= $2 GROUP BY doctor.doctor_first_name, doctor.doctor_last_name ORDER BY COUNT(availability_taken) DESC;',
			[startDate, endDate]
		);

		const specialtyAppts = await db.query(
			'SELECT COUNT(availability_taken) AS count, doctor_specialty FROM availability JOIN doctor ON availability.doctor_id = doctor.doctor_id WHERE availability_taken IS TRUE AND availability_date::date >= $1 AND availability_date::date <= $2 GROUP BY doctor_specialty ORDER BY COUNT(availability_taken) DESC;',
			[startDate, endDate]
		);

		const apptCount = await db.query(
			'SELECT COUNT(availability_taken) AS count FROM availability WHERE availability_taken IS TRUE AND availability_date::date >= $1 AND availability_date::date <= $2;',
			[startDate, endDate]
		);

		res.status(200).json({
			message: 'OK',
			doctors: doctors.rows,
			doctorAppts: doctorAppts.rows,
			specialtyAppts: specialtyAppts.rows,
			apptCount: apptCount.rows,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

module.exports = router;
