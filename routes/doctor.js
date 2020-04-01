const { Router } = require('express');
const { doc } = require('../middleware/auth');
const { updateDoctorSchema, validate } = require('../validation');

const router = Router();
const db = require('../config/db');

router.put('/update', doc, async (req, res) => {
    try {
        await validate(updateDoctorSchema, req.body, req, res);
        const {
            firstName, lastName, email, address, city, state, zip, phoneNumber, office,
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

        // UPDATE DOCTOR TABLE
        await db.query('UPDATE doctor SET doctor_first_name = $1, doctor_last_name = $2, doctor_email = $3, doctor_phone_number = $4, doctor_office = $5 WHERE doctor_user = $6',
            [firstName, lastName, email, phoneNumber, office, userID]);

        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});



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
