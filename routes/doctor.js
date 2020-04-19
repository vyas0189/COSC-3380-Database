const { Router } = require('express');
const { doc } = require('../middleware/auth');
const {
	updateDoctor,
	updateDiagnosis,
	orderTest,
	addAvailability,
	updateAvailability,
} = require('../validation');

const router = Router();
const db = require('../config/db');

router.put('/update', doc, async (req, res) => {
	try {
		await updateDoctor.validateAsync(req.body, { abortEarly: false });
		const {
			firstName,
			lastName,
			email,
			address,
			city,
			state,
			zip,
			phoneNumber,
			office,
		} = req.body;

		let { address2 } = req.body;
		const { userID } = req.user;
		const user = await db.query(
			'SELECT user_id FROM db_user WHERE user_id = $1',
			[userID],
		);

		if (!user.rows.length) {
			return res.status(401).json({ message: 'User not found.' });
		}

		if (address2 === 'n/a' || address2 === 'N/A') {
			address2 = null;
		}

		const doctorAddressID = await db.query(
			'SELECT doctor_address FROM doctor WHERE doctor_user = $1',
			[userID],
		);

		await db.query(
			'UPDATE address SET address_name = $1, address2_name = $2, city = $3, state = $4, zip = $5 WHERE address_id = $6',
			[
				address,
				address2,
				city,
				state,
				zip,
				doctorAddressID.rows[0].doctor_address,
			],
		);

		await db.query(
			'UPDATE doctor SET doctor_first_name = $1, doctor_last_name = $2, doctor_email = $3, doctor_phone_number = $4, doctor_office = $5 WHERE doctor_user = $6',
			[firstName, lastName, email, phoneNumber, office, userID],
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/order/test', doc, async (req, res) => {
	try {
		await orderTest.validateAsync(req.body, { abortEarly: false });
		const {
			patientID, scan, physical, blood,
		} = req.body;

		const { userID } = req.user;

		const doctor = await db.query(
			'SELECT * FROM doctor WHERE doctor_user = $1',
			[userID],
		);

		const patient = await db.query(
			'SELECT * FROM patient WHERE patient_id = $1',
			[patientID],
		);

		if (patient.rows.length === 0) {
			return res.status(401).json({
				message: 'That patient is not in our database. Please try again.',
			});
		}

		await db.query(
			'INSERT INTO test(test_scan, test_physical, test_blood, test_office, test_doctor, test_patient, test_diagnosis) VALUES($1, $2, $3, $4, $5, $6, $7)',
			[
				scan,
				physical,
				blood,
				doctor.rows[0].doctor_office,
				doctor.rows[0].doctor_id,
				patient.rows[0].patient_id,
				patient.rows[0].patient_diagnosis,
			],
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.put('/update/diagnosis', doc, async (req, res) => {
	try {
		await updateDiagnosis.validateAsync(req.body, { abortEarly: false });
		const { patientID, symptoms, condition } = req.body;

		const patient = await db.query(
			'SELECT * FROM patient WHERE patient_id = $1',
			[patientID],
		);

		if (patient.rows.length === 0) {
			return res.status(401).json({
				message: 'That patient is not in our database. Please try again.',
			});
		}

		const diagnosis = await db.query(
			'SELECT * FROM diagnosis WHERE diagnosis_symptoms = $1 AND diagnosis_condition = $2',
			[symptoms, condition],
		);

		if (diagnosis.rows.length === 0) {
			return res
				.status(401)
				.json({ message: 'Please enter a valid diagnosis' });
		}

		const update = await db.query(
			'UPDATE patient SET patient_diagnosis = $1 WHERE patient_id = $2 RETURNING *',
			[diagnosis.rows[0].diagnosis_id, patientID],
		);

		if (update.rows.length === 0) {
			return res.status(401).json({
				message:
					'That patient cannot be diagnosed, they have not seen a primary care doctor yet',
			});
		}

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/add/availability', doc, async (req, res) => {
	try {
		await addAvailability.validateAsync(req.body, { abortEarly: false });
		const { officeID, availabilityDate } = req.body;

		const { userID } = req.user;
		const user = await db.query(
			'SELECT user_id FROM db_user WHERE user_id = $1',
			[userID],
		);

		if (!user.rows.length) {
			return res.status(401).json({ message: 'User not found.' });
		}

		const doctor = await db.query(
			'SELECT * FROM doctor WHERE doctor_user = $1',
			[userID],
		);

		const availability = await db.query(
			'SELECT * FROM availability WHERE doctor_id = $1 AND availability_date = $2',
			[doctor.rows[0].doctor_id, availabilityDate],
		);

		if (availability.rows.length > 0) {
			return res.status(401).json({
				message:
					'You already have availability times set for that date. Please update your availability if you would like to make changes.',
			});
		}

		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'9:00 AM',
				'10:00 AM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'10:00 AM',
				'11:00 AM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'11:00 AM',
				'12:00 PM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'12:00 PM',
				'1:00 PM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'1:00 PM',
				'2:00 PM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'2:00 PM',
				'3:00 PM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'3:00 PM',
				'4:00 PM',
				false,
			],
		);
		await db.query(
			'INSERT INTO availability (doctor_id, office_id, availability_date, availability_from_time, availability_to_time, availability_taken) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				doctor.rows[0].doctor_id,
				officeID,
				availabilityDate,
				'4:00 PM',
				'5:00 PM',
				false,
			],
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

// router.put('/update/availability', doc, async (req, res) => {
// 	try {
// 		await updateAvailability.validateAsync(req.body, { abortEarly: false });
// 		const { availabilityID, taken } = req.body;

// 		const { userID } = req.user;
// 		const user = await db.query(
// 			'SELECT user_id FROM db_user WHERE user_id = $1',
// 			[userID],
// 		);

// 		if (!user.rows.length) {
// 			return res.status(401).json({ message: 'User not found.' });
// 		}

// 		const availability = await db.query(
// 			'SELECT * FROM availability WHERE availability_id = $1',
// 			[availabilityID],
// 		);

// 		if (availability.rows.length === 0) {
// 			return res.status(401).json({
// 				message: 'You have no availability slots at that time.',
// 			});
// 		}

// 		await db.query(
// 			'UPDATE availability SET availability_taken = $1 WHERE availability_id = $2',
// 			[taken, availabilityID],
// 		);

// 		res.status(200).json({ message: 'OK' });
// 	} catch (error) {
// 		res.status(500).json({ message: 'Server Error', error });
// 	}
// });

router.get('/get/offices', doc, async (req, res) => {
	try {
		const offices = await db.query(
			'SELECT * FROM address INNER JOIN office ON (address.address_id = office.office_address)',
		);

		res.status(200).json({
			message: 'OK',
			offices: offices.rows,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/get/patients', doc, async (req, res) => {
	try {
		const patients = await db.query('SELECT * FROM patient');

		res.status(200).json({
			message: 'OK',
			offices: patients.rows,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.get('/allAvailability/:doctorID', async (req, res) => {
	try {
		const { doctorID } = req.params;

		const availability = await db.query('SELECT doctor_id, availability_date, a.office_id, address_name, address2_name, state, city, zip FROM availability a JOIN office o on a.office_id = o.office_id JOIN address a2 on o.office_address = a2.address_id WHERE doctor_id = $1 AND availability_date >= CURRENT_DATE GROUP BY availability_date, doctor_id, a.office_id, a2.address_name, a2.address2_name, a2.state, a2.city, a2.zip ORDER BY availability_date; ', [doctorID]);

		res.status(200).json({ message: 'OK', availabilities: availability.rows });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.put('/updateAvailability', async (req, res) => {
	const {
		newDate, officeID, doctorID, date,
	} = req.body;

	try {
		await db.query(
			'UPDATE availability SET availability_date = $1, office_id = $2 WHERE doctor_id = $3 AND availability_date = $4;',
			[
				newDate, officeID, doctorID, date,
			],
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

router.delete('/cancelAvailability', async (req, res) => {
	const { doctorID, date } = req.body;

	try {
		await db.query(
			'DELETE FROM availability WHERE doctor_id = $1 AND availability_date = $2',
			[
				doctorID, date,
			],
		);

		res.status(200).json({ message: 'OK' });
	} catch (error) {
		res.status(500).json({ message: 'Server Error', error });
	}
});

module.exports = router;
