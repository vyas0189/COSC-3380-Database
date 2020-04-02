const { Router } = require('express');
const { auth, doc } = require('../middleware/auth');
const { schedulePrimaryAppointment, validate } = require('../validation')
const router = Router();
const db = require('../config/db');

router.post('/schedule/primaryAppointment', auth, async (req, res) => {
    try {
        await validate(schedulePrimaryAppointment, req.body, req, res);
        const {
            primaryAppointment, reason, availabilityID,
        } = req.body;
        console.log(req.user);

        const { userID } = req.user;
        console.log(userID);

        const patient = await db.query('SELECT patient_id FROM patient WHERE patient_user = $1',
            [userID]);
        
        const appointment = await db.query('INSERT INTO appointment(appointment_patient, appointment_primary, appointment_reason, appointment_availability) VALUES($1, $2, $3, $4) RETURNING *',
            [patient.rows[0].patient_id, primaryAppointment, reason, availabilityID]);

        const updatedAvailability = await db.query('UPDATE availability SET availability_taken = true WHERE availability_id = $1 RETURNING *',
            [availabilityID]);
        
        await db.query('UPDATE patient SET patient_primary_doctor = $1 WHERE patient_id = $2',
            [updatedAvailability.rows[0].doctor_id, patient.rows[0].patient_id]);

        res.status(200).json({ message: 'OK', appointment: appointment.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

router.post('/schedule/specialistAppointment', auth, async (req, res) => {
    try {
        await validate(schedulePrimaryAppointment, req.body, req, res);
        const {
            primaryAppointment, reason, availabilityID,
        } = req.body;
        
        const { userID } = req.user;
       
        const patient = await db.query('SELECT patient_id FROM patient WHERE patient_user = $1',
            [userID]);

        console.log(patient.rows[0].patient_id);

        const appointment = await db.query('INSERT INTO appointment(appointment_patient, appointment_primary, appointment_reason, appointment_availability) VALUES($1, $2, $3, $4) RETURNING *',
            [patient.rows[0].patient_id, primaryAppointment, reason, availabilityID]);

        await db.query('UPDATE availability SET availability_taken = TRUE WHERE availability_id = $1',
            [availabilityID]);

        res.status(200).json({ message: 'OK', appointment: appointment.rows[0] });
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