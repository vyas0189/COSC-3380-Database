const { Router } = require('express');
const { auth, doc } = require('../middleware/auth');
const {
    validate, schedulePrimaryAppointment, scheduleSpecialistAppointment, viewAppointmentsWithPatient, cancelAppointment,
} = require('../validation');

const router = Router();
const db = require('../config/db');

router.post('/schedule/primaryAppointment', auth, async (req, res) => {
    try {
        await schedulePrimaryAppointment.validateAsync(req.body, { abortEarly: false });
        const {
            primaryAppointment, reason, availabilityID,
        } = req.body;

        const { userID } = req.user;

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
        await scheduleSpecialistAppointment.validateAsync(req.body, { abortEarly: false });
        const {
            primaryAppointment, reason, availabilityID,
        } = req.body;

        const { userID } = req.user;

        const patient = await db.query('SELECT patient_id FROM patient WHERE patient_user = $1',
            [userID]);

        const appointment = await db.query('INSERT INTO appointment(appointment_patient, appointment_primary, appointment_reason, appointment_availability) VALUES($1, $2, $3, $4) RETURNING *',
            [patient.rows[0].patient_id, primaryAppointment, reason, availabilityID]);

        if (appointment.rows.length === 0) {
            return res.status(401).json({ message: 'You must be approved by a primary doctor before you can see a specialist.' });
        }

        await db.query('UPDATE availability SET availability_taken = TRUE WHERE availability_id = $1',
            [availabilityID]);

        res.status(200).json({ message: 'OK', appointment: appointment.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

router.delete('/cancel', auth, async (req, res) => {
    try {
        await cancelAppointment.validateAsync(req.body, { abortEarly: false });
        const {
            appointmentID,
        } = req.body;

        const { userID } = req.user;

        const patient = await db.query('SELECT * FROM patient WHERE patient_user = $1',
            [userID]);

        const appointment = await db.query('SELECT * FROM appointment WHERE appointment_id = $1 AND appointment_patient = $2',
            [appointmentID, patient.rows[0].patient_id]);

        if (appointment.rows.length === 0) {
            return res.status(401).json({ message: 'You do not have an appointment scheduled then.' });
        }

        await db.query('SELECT * FROM availability WHERE availability_id = $1',
            [appointment.rows[0].appointment_availability]);

        // setting taken condition to false
        await db.query('UPDATE availability SET availability_taken = FALSE WHERE availability_id = $1',
            [appointment.rows[0].appointment_availability]);

        await db.query('DELETE FROM appointment WHERE appointment_id = $1 AND appointment_patient = $2',
            [appointmentID, patient.rows[0].patient_id]);


        res.status(200).json({ message: 'OK - appointment deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

router.get('/view/myAppointments', auth, async (req, res) => {
    try {
        const { userID } = req.user;

        const patient = await db.query('SELECT patient_id FROM patient WHERE patient_user = $1',
            [userID]);

        const appointments = await db.query('SELECT * FROM appointment WHERE appointment_patient = $1',
            [patient.rows[0].patient_id]);

        if (appointments.rows.length === 0) {
            return res.status(401).json({ message: 'You do not have any appointments scheduled.' });
        }

        res.status(200).json({ message: 'OK', appointments: appointments.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});


router.get('/view/appointmentsWithPatient', doc, async (req, res) => {
    try {
        await viewAppointmentsWithPatient.validateAsync(req.body, { abortEarly: false });
        const {
            patientID,
        } = req.body;

        const patient = await db.query('SELECT * FROM patient WHERE patient_id = $1',
            [patientID]);

        if (patient.rows.length === 0) {
            return res.status(401).json({ message: 'That patient is not in our database. Please try again.' });
        }

        const appointments = await db.query('SELECT * FROM appointment WHERE appointment_patient = $1',
            [patientID]);

        if (appointments.rows.length === 0) {
            return res.status(401).json({ message: 'That patient does not have any appointments scheduled' });
        }

        res.status(200).json({ message: 'OK', appointments: appointments.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

module.exports = router;
