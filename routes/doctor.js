const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { updateDoctorSchema, validate } = require('../validation');

const router = Router();
const db = require('../config/db');

router.put('/update', auth, async (req, res) => {
    try {
        await validate(updateDoctorSchema, req.body, req, res);
        const {
            firstName, lastName, email, address, city, state, zip, phoneNumber, primary, specialty, office,
        } = req.body;

        let { address2 } = req.body;
        const { userID } = req.user;
        const user = await db.query('SELECT user_id FROM db_user WHERE user_id = $1', [userID]);

        if (!user.rows.length) {
            return res.status(401).json({ message: 'User not found.' });
        }

        if (address2 === 'n/a' || address2 === 'N/A') {
            address2 = null;
        }

        const doctorAddressID = await db.query('SELECT doctor_address FROM doctor WHERE doctor_user = $1',
            [userID]);


        await db.query('UPDATE address SET address_name = $1, address2_name = $2, city = $3, state = $4, zip = $5 WHERE address_id = $6',
            [address, address2, city, state, zip, doctorAddressID.rows[0].doctor_address]);

        // UPDATE PATIENT TABLE
        await db.query('UPDATE doctor SET doctor_first_name = $1, doctor_last_name = $2, doctor_email = $3, doctor_phone_number = $4, doctor_primary = $5, doctor_specialty = $6, doctor_office = $7 WHERE doctor_user = $8',
            [firstName, lastName, email, phoneNumber, primary, specialty, office, userID]);

        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

// router.get('/view/allAppointments', auth, async (req, res) => {
//     try {

//         const { userID } = req.user;
//         const user = await db.query('SELECT user_id FROM db_user WHERE user_id = $1', [userID]);

//         const doctorID = await db.query('SELECT doctor_id FROM doctor WHERE doctor_user = $1', [userID]);

//         const { appointments } = await db.query('SELECT * FROM appointments WHERE appointment_doctor = $1', [doctorID]);

//         if (appointments.length === 0) {
//             return res.status(401).json({ message: 'No appointments have been scheduled with you.' });
//         }

//         const { patients } = await db.query('SELECT appointment_patient FROM appointments WHERE appointment_doctor = $1', [doctorID]);

//         for (var i = 0; i < patients.length; i++) {

//             const currAppointment = appointments[i].rows[0];

//             // ****this might be wrong...****
//             const currPatient = patients[i];

//             const { patientInfo } = await db.query('SELECT * FROM patient WHERE patient_id = $1',
//                 [currPatient.rows[0]]);

//             const officeID = appointments[i].rows[0].appointment_office;

//             // ****this might be wrong...****
//             const officeAddressID = await db.query('SELECT office_address FROM office WHERE office_id = $1',
//                 [officeID.rows[0]]);

//             const { officeAddress } = await db.query('SELECT * FROM address WHERE address_id = $1',
//                 [officeAddressID.rows[0]]);


//             res.json('Appointment #:', i,
//                 '\nName: ', patientInfo.rows[0].patient_first_name, ' ', patientInfo.rows[0].patient_last_name,
//                 '\nDOB: ', patientInfo.rows[0].patient_dob,
//                 '\nDiagnosis', patientInfo.rows[0].patient_diagnosis,
//                 '\nName: ', patientInfo.rows[0].patient_first_name, ' ', patientInfo.rows[0].patient_last_name,
//                 '\nDOB: ', patientInfo.rows[0].patient_dob,
//                 '\nDate: ', currAppointment.rows[0].appointment_date,
//                 '\nTime: ', currAppointment.rows[0].appointment_start,
//                 '\nReason: ', currAppointment.rows[0].appointment_reason,
//                 '\nAddress: ',
//                 '\n', officeAddress.rows[0].address_name,
//                 '\n', officeAddress.rows[0].city, ', ', officeAddress.rows[0].state, ' ', officeAddress.rows[0].zip,
//                 '\n');
//         }


//         res.status(200).json({ message: 'OK' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', err });
//     }
// });

// router.get('/view/appointmentsWithPatient', auth, async (req, res) => {
//     try {
//         await validate(viewAppointmentsWithPatient, req.body, req, res);
//         const {
//             firstName, lastName, dob,
//         } = req.body;

//         const { userID } = req.user;
//         const user = await db.query('SELECT user_id FROM db_user WHERE user_id = $1', [userID]);

//         const patientID = await db.query('SELECT patient_id FROM patient WHERE patient_first_name = $1, patient_last_name = $2, patient_dob = $3',
//             [firstName, lastName, dob]);

//         if (patientID.rows.length === 0) {
//             return res.status(401).json({ message: 'That patient is not in our database. Please try again.' });
//         }

//         const patientInfo = await db.query('SELECT * FROM patient WHERE patient_id = $1',
//             [patientID]);

//         const { appointments } = await db.query('SELECT * FROM appointments WHERE appointment_patient = $1', [patientID]);

//         for (var i = 0; i < appointments.length; i++) {

//             const currAppointment = appointments[i].rows[0];

//             const officeID = appointments[i].rows[0].appointment_office;

//             const officeAddressID = await db.query('SELECT office_address FROM office WHERE office_id = $1',
//                 [officeID.rows[0]]);

//             const { officeAddress } = await db.query('SELECT * FROM address WHERE address_id = $1',
//                 [officeAddressID.rows[0]]);


//             res.json('Appointment #:', i,
//                 '\nName: ', patientInfo.rows[0].patient_first_name, ' ', patientInfo.rows[0].patient_last_name,
//                 '\nDOB: ', patientInfo.rows[0].patient_dob,
//                 '\nDiagnosis', patientInfo.rows[0].patient_diagnosis,
//                 '\nDate: ', currAppointment.rows[0].appointment_date,
//                 '\nTime: ', currAppointment.rows[0].appointment_start,
//                 '\nReason: ', currAppointment.rows[0].appointment_reason,
//                 '\nAddress: ',
//                 '\n', officeAddress.rows[0].address_name,
//                 '\n', officeAddress.rows[0].city, ', ', officeAddress.rows[0].state, ' ', officeAddress.rows[0].zip,
//                 '\n');
//         }


//         res.status(200).json({ message: 'OK' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', err });
//     }
// });

// router.put('/update/patientDiagnosis', auth, async (req, res) => {
//     try {
//         await validate(updateDiagnosis, req.body, req, res);
//         const {
//             firstName, lastName, dob, symptoms, condition,
//         } = req.body;

//         const { userID } = req.user;
//         const user = await db.query('SELECT user_id FROM db_user WHERE user_id = $1', [userID]);

//         const patientID = await db.query('SELECT patient_id FROM patient WHERE patient_first_name = $1, patient_last_name = $2, patient_dob = $3',
//             [firstName, lastName, dob]);

//         if (patientID.rows.length === 0) {
//             return res.status(401).json({ message: 'That patient is not in our database. Please try again.' });
//         }

//         const diagnosisID = await db.query('SELECT diagnosis_id FROM diagnosis WHERE diagnosis_symptoms = $1, diagnosis_condition = $2',
//             [symptoms, condition])

//         if (diagnosisID.rows.length === 0) {
//             return res.status(401).json({ message: 'That diagnosis is not in our database. Please try again.' });
//         }

//         await db.query('UPDATE patient SET patient_diagnosis = $1 WHERE patient_id = $2',
//             [diagnosisID, patientId.rows[0]]);

//         res.status(200).json({ message: 'OK' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', err });
//     }
// });

// router.post('/insert/test', auth, async (req, res) => {
//     try {
//         await validate(orderTest, req.body, req, res);
//         const {
//             firstName, lastName, dob, date, scan, physical, blood,
//         } = req.body;

//         const { userID } = req.user;
//         const user = await db.query('SELECT user_id FROM db_user WHERE user_id = $1', [userID]);

//         const { patient } = await db.query('SELECT * FROM patient WHERE patient_first_name = $1, patient_last_name = $2, patient_dob = $3',
//             [firstName, lastName, dob]);

//         if (patient.rows.length === 0) {
//             return res.status(401).json({ message: 'That patient is not in our database. Please try again.' });
//         }

//         await db.query('INSERT INTO test(test_date, test_scan, test_physical, test_blood, test_office, test_doctor, test_patient, test_diagnosis) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
//             [date, scan, physical, blood, user.rows[0].doctor_office, user.rows[0].doctor_id, patient.rows[0].patient_id, patient.rows[0].patient_diagnosis]);

//         res.status(200).json({ message: 'OK' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', err });
//     }
// });


module.exports = router;
