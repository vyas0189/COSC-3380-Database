const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { updatePatientSchema, validate } = require('../validation');

//registerPatientSchema

const router = Router();
const db = require('../config/db');

router.put('/update', auth, async (req, res) => {
    try {
        await validate(updatePatientSchema, req.body, req, res);
        const {
            firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender,
        } = req.body;

        let { address2 } = req.body;
        const { userID } = req.user;
        const user = await db.query('SELECT patient_address FROM patient p JOIN db_user du on p.patient_user = du.user_id WHERE du.user_id = $1', [userID]);

        if (!user.rows.length) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (address2 === 'n/a' || address2 === 'N/A') {
            address2 = null;
        }

        await db.query('UPDATE address SET address_name = $1, address2_name = $2, city = $3, state = $4, zip = $5 WHERE address_id = $6',
            [address, address2, city, state, zip, user.rows[0].patient_address]);

        // UPDATE PATIENT TABLE
        await db.query('UPDATE patient SET patient_first_name = $1, patient_last_name = $2, patient_email = $3, patient_phone_number = $4, patient_gender = $5, patient_dob = $6 WHERE patient_user = $7',
            [firstName, lastName, email, phoneNumber, gender, dob, userID]);


        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

// router.post('/schedule/primaryAppointment', auth, async (req, res) => {
//     try {
//         await validate(schedulePrimaryAppointment, req.body, req, res);
//         const {
//             date, startTime, endTime, specialty, primaryAppointment, reason,
//         } = req.body;

//         const { userID } = req.user;

//         const patient = await db.query('SELECT * FROM patient WHERE patient_user = $1',
//             [userID]);

//         const patientAddress = patient.rows[0].address;

//         const patientCity = await db.query('SELECT city FROM address WHERE address_id = $1',
//             [patientAddress]);

//         const { specialistDoctors } = await db.query('SELECT doctor_id FROM doctor WHERE doctor_primary = $1',
//             true);

//         const { doctorsInCity };

//         for (var j = 0; j < specialistDoctors.length; j++) {

//             const currentDoctor = specialistDoctors[j].rows[0];

//             const doctorAddress = currentDoctor.rows[0].address;

//             const doctorCity = await db.query('SELECT city FROM address WHERE address_id = $1',
//                 [doctorAddress]);

//             if (patientCity === doctorCity) {
//                 doctorsInCity.push(currentDoctor);
//             }
//         }

//         const { availableDoctors };

//         for (var j = 0; j < doctorsInCity.length; j++) {

//             const currentDoctor = doctorsInCity[j].rows[0];

//             let doctorAvailability = await db.query('SELECT * from availability WHERE doctor_id = $1',
//                 [currentDoctor.doctor_id]);

//             if (date == doctorAvailability.rows[0].availability_date && doctorAvailability.rows[0].availability_from_time <= startTime && startTime < doctorAvailability.rows[0].availability_from_time) {

//                 availableDoctors.push(currentDoctor);
//                 console.log(specialistDoctors[j].rows[0], doctor_first_name, specialistDoctors[j].rows[0], doctor_last_name);
//             }
//         }

//         if (availableDoctors.length === 0) {
//             return res.status(401).json({ message: 'No primary doctors with that date & time are available. Please try again.' });
//         }

//         // frontend displays names of all doctors that patient can see

//         await validate(chooseDoctor, req.body, req, res);
//         const {
//             firstName, lastName,
//         } = req.body;

//         const chosenDoctor = await db.query('SELECT doctor_id FROM doctor WHERE doctor_first_name = $1, doctor_last_name = $2'
//         [firstName, lastName]);

//         await db.query('INSERT INTO appointment(appointment_patient, appointment_doctor, appointment_date, appointment_start, appointment_end, appointment_primary, appointment_reason, appointment_office) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//             [userID, chosenDoctor.rows[0].doctor_id, date, startTime, endTime, appointmentPrimary, reason, chosenDoctor.rows[0].doctor_office]);

//         // first time with a primary physician
//         if (patient.rows[0].patient_primary_doctor === null) {
//             await db.query('UPDATE patient SET patient_primary_doctor = $1 WHERE patient_user = $2',
//                 [chosenDoctor.rows[0].doctor_id, userID])
//         }


//         res.status(200).json({ message: 'OK' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', err });
//     }
// });

// router.post('/schedule/specialistAppointment', auth, async (req, res) => {
//     try {
//         await validate(scheduleSpecialistAppointment, req.body, req, res);

//         const {
//             date, startTime, endTime, specialty, primaryAppointment, reason,
//         } = req.body;

//         const { userID } = req.user;

//         const patient = await db.query('SELECT * FROM patient WHERE patient_user = $1',
//             [userID]);

//         //trigger for checking if patient has already had primary care appointment

//         if (patient.rows[0].patient_primary_doctor === null) {
//             return res.status(401).json({ message: 'You need to schedule an appointment with primary care doctor before you can see a specialist. Please schedule an appointment with a primary care doctor.' });
//         }

//         const patientAddress = patient.rows[0].address;

//         const patientCity = await db.query('SELECT city FROM address WHERE address_id = $1',
//             [patientAddress]);

//         const { specialistDoctors } = await db.query('SELECT doctor_id FROM doctor WHERE doctor_specialty = $1',
//             [specialty]);

//         const { doctorsInCity };

//         for (var j = 0; j < specialistDoctors.length; j++) {

//             const currentDoctor = specialistDoctors[j].rows[0];

//             const doctorAddress = currentDoctor.rows[0].address;

//             const doctorCity = await db.query('SELECT city FROM address WHERE address_id = $1',
//                 [doctorAddress]);

//             if (patientCity.rows[0] === doctorCity.rows[0]) {
//                 doctorsInCity.push(currentDoctor);
//             }
//         }

//         const { availableDoctors };

//         for (var j = 0; j < doctorsInCity.length; j++) {

//             const currentDoctor = doctorsInCity[j].rows[0];

//             let doctorAvailability = await db.query('SELECT * from availability WHERE doctor_id = $1',
//                 [currentDoctor.doctor_id]);

//             if (date == doctorAvailability.rows[0].availability_date && doctorAvailability.rows[0].availability_from_time <= startTime && startTime < doctorAvailability.rows[0].availability_from_time) {

//                 availableDoctors.push(currentDoctor);
//                 console.log(specialistDoctors[j].rows[0], doctor_first_name, specialistDoctors[j].rows[0], doctor_last_name);
//             }
//         }

//         if (availableDoctors.length === 0) {
//             return res.status(401).json({ message: 'No specialist doctors with that date & time are available. Please try again.' });
//         }

//         // frontend displays names of all doctors that patient can see

//         await validate(chooseDoctor, req.body, req, res);
//         const {
//             firstName, lastName,
//         } = req.body;

//         const chosenDoctor = await db.query('SELECT doctor_id FROM doctor WHERE doctor_first_name = $1, doctor_last_name = $2'
//         [firstName, lastName]);

//         await db.query('INSERT INTO appointment(appointment_patient, appointment_doctor, appointment_date, appointment_start, appointment_end, appointment_primary, appointment_reason, appointment_office) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//             [userID, chosenDoctor.rows[0].doctor_id, date, startTime, endTime, appointmentPrimary, reason, chosenDoctor.rows[0].doctor_office]);

//         res.status(200).json({ message: 'OK' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server Error', err });
//     }
// });

router.delete('/cancel', auth, async (req, res) => {
    try {
        await validate(cancelAppointment, req.body, req, res);
        const {
            date
        } = req.body;

        const { userID } = req.user;

        const patient = await db.query('SELECT * FROM patient WHERE patient_user = $1',
            [userID]);

        const { scheduledAppointment } = await db.query('SELECT * FROM appointment WHERE appointment_patient = $1, appointment_date = $2',
            [userID, date]);

        if (patient.rows.length === 0) {
            return res.status(401).json({ message: 'You do not have an appointment scheduled on ' + date });
        }

        await db.query('DELETE * FROM appointment WHERE appointment_patient = $1, appointment_date = $2',
            [userID, date]);

        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

module.exports = router;


