const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { doc } = require('../middleware/auth');

const router = Router();
const db = require('../config/db');

router.post('/schedule/primaryAppointment', auth, async (req, res) => {
    try {
        await validate(schedulePrimaryAppointment, req.body, req, res);
        const {
            date, startTime, endTime, specialty, primaryAppointment, reason,
        } = req.body;

        const { userID } = req.user;

        const patient = await db.query('SELECT * FROM patient WHERE patient_user = $1',
            [userID]);

        const patientAddress = patient.rows[0].address;

        const patientCity = await db.query('SELECT city FROM address WHERE address_id = $1',
            [patientAddress]);

        const { primaryDoctors } = await db.query('SELECT doctor_id FROM doctor WHERE doctor_primary = $1',
            true);

        const { doctorsInCity } = primaryDoctors.map(doctor => await db.query('SELECT city FROM address WHERE address_id = $1',
            [doctor.rows[0].address]));

        console.log(doctorsInCity);

        // const { availableDoctors };

        // for (var j = 0; j < doctorsInCity.length; j++) {

        //     const currentDoctor = doctorsInCity[j].rows[0];

        //     let doctorAvailability = await db.query('SELECT * from availability WHERE doctor_id = $1',
        //         [currentDoctor.doctor_id]);

        //     if (date == doctorAvailability.rows[0].availability_date && doctorAvailability.rows[0].availability_from_time <= startTime && startTime < doctorAvailability.rows[0].availability_from_time) {

        //         availableDoctors.push(currentDoctor);
        //         console.log(specialistDoctors[j].rows[0], doctor_first_name, specialistDoctors[j].rows[0], doctor_last_name);
        //     }
        // }

        // if (availableDoctors.length === 0) {
        //     return res.status(401).json({ message: 'No primary doctors with that date & time are available. Please try again.' });
        // }

        // // frontend displays names of all doctors that patient can see

        // await validate(chooseDoctor, req.body, req, res);
        // const {
        //     firstName, lastName,
        // } = req.body;

        // const chosenDoctor = await db.query('SELECT doctor_id FROM doctor WHERE doctor_first_name = $1, doctor_last_name = $2'
        // [firstName, lastName]);

        // await db.query('INSERT INTO appointment(appointment_patient, appointment_doctor, appointment_date, appointment_start, appointment_end, appointment_primary, appointment_reason, appointment_office) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        //     [userID, chosenDoctor.rows[0].doctor_id, date, startTime, endTime, appointmentPrimary, reason, chosenDoctor.rows[0].doctor_office]);

        // // first time with a primary physician
        // if (patient.rows[0].patient_primary_doctor === null) {
        //     await db.query('UPDATE patient SET patient_primary_doctor = $1 WHERE patient_user = $2',
        //         [chosenDoctor.rows[0].doctor_id, userID])
        // }


        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

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

//         for (let i = 0; i < patients.length; i++) {
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

module.exports = router;