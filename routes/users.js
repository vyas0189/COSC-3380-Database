const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { validate, registerPatientSchema } = require('../validation');
// const moment = require('moment');
const db = require('../config/db');

const router = Router();

// look for doctor availability

router.get('/', async (req, res) => {
  // try {
  //   const { rows } = await db.query({ text: 'SELECT (doctor_availability) FROM doctor;' });
  //   if (rows.length > 0) {
  //     const t = rows[0].doctor_availability.map((d, i) => {
  //       if (!d.taken) {
  //         const tem = d.time.split(',')[0].replace('[', '');
  //         const date = moment(new Date(Date.parse(tem))).utc().format('MM/DD/YYYY');
  //         const time = moment(new Date(Date.parse(tem))).utc().format('hh:mm:ss A');
  //         return {
  //           idx: i + 1, date, time, taken: d.taken,
  //         };
  //       }
  //     });

  //     res.status(200).json({ t });
  //   } else {
  //     res.status(500).json({ message: 'User Not Found' });
  //   }
  // } catch (err) {
  //   res.json({ message: 'Please enter a valid ID', err });
  // }
  res.send('Hi');
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

router.get('/appointments', async (req, res) => {
  try {
    const { patients } = await db.query('SELECT patient_id FROM appointment WHERE appt_doctor = doctor_id');
    if (patients.length > 0) {
      patients.forEach((patient) => {
        const patient_Info = db.query('SELECT (patient_first_name, patient_last_name, patient_diagnosis) WHERE patient_id = $1',
          [patient]);

        console.log(patient_Info);
      });
    } else {
      res.status(500).json({ message: 'User Not Found' });
    }
  } catch (err) {
    res.json({ message: 'Please enter a valid ID', err });
  }
});

// from patient's side

router.post('/update/patientInfo', async (req, res) => {
  const {
    patient_id,
    patient_first_name,
    patient_last_name,
    patient_email,
    patient_phone_number,
    patient_gender,
    patient_address,
    patient_dob,
  } = req.body;

  try {
    const patient = await db.query("SELECT * FROM patient WHERE patient_id = $1'",
      [patient_id]);

    if (patient !== NULL) {
      db.query('UPDATE patient SET (patient_first_name = $1, patient_last_name = $2, patient_email = $3, patient_phone_number = $4, patient_gender = $5, patient_address = $6, patient_dob = $7) WHERE patient_id = $8,'

      [
        patient_first_name,
        patient_last_name,
        patient_email,
        patient_phone_number,
        patient_gender,
        patient_address,
        patient_dob,
        patient_id
      ]);
    } else {
      res.status(500).json({ message: 'That patient does not exist.' });
    }
  } catch (err) {
    res.json({ message: 'Please enter a valid patient ID', err });
  }
});

// update doctor info

router.post('/update/doctorInfo', async (req, res) => {
  const {
    doctor_id,
    doctor_first_name,
    doctor_last_name,
    doctor_phone_number,
  } = req.body;

  try {
    const patient = await db.query("SELECT * FROM doctor WHERE doctor_id = $1'",
      [patient_id]);

    if (patient !== NULL) {
      db.query('UPDATE patient SET (doctor_first_name = $1, doctor_last_name = $2, doctor_phone_number = $3) WHERE doctor_id = $4,'

      [
        doctor_first_name,
        doctor_last_name,
        doctor_phone_number,
        doctor_id
      ]);
    } else {
      res.status(500).json({ message: 'That doctor does not exist.' });
    }
  } catch (err) {
    res.json({ message: 'Please enter a valid doctor ID', err });
  }
});


// doctor updating patient info
router.post('/update/patientInfo', async (req, res) => {
  const { patient_id, patient_diagnosis, patient_primary_doctor } = req.body;

  try {
    const patient = await db.query("SELECT * FROM patient WHERE patient_id = $1'",
      [patient_id]);

    if (patient !== NULL) {
      db.query('UPDATE patient SET (patient_diagnosis = $1, patient_primary_doctor = $2) WHERE patient_id = $3,'

      [patient_id,
      patient_diagnosis,
        patient_primary_doctor]);
    } else {
      res.status(500).json({ message: 'That patient does not exist.' });
    }
  } catch (err) {
    res.json({ message: 'Please enter a valid patient ID', err });
  }
});


module.exports = router;
