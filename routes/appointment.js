const { Router } = require('express');
const { auth, doc } = require('../middleware/auth');
const {
    schedulePrimaryAppointment, scheduleSpecialistAppointment, viewAppointmentsWithPatient, cancelAppointment,
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
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
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
    } catch (error) {
        res.status(500).json({ message: 'Unable to schedule.', error });
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


        res.status(200).json({ message: 'OK' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.get('/view/myAppointments', auth, async (req, res) => {
    try {
        const { userID } = req.user;
        const patient = await db.query('SELECT patient_id FROM patient WHERE patient_user = $1',
            [userID]);

        const appointments = await db.query('SELECT * FROM appointment app JOIN (SELECT * FROM availability av JOIN doctor d on av.doctor_id = d.doctor_id JOIN (SELECT * FROM office JOIN address a on office.office_address = a.address_id) AS o ON av.office_id = o.office_id) as info ON app.appointment_availability = info.availability_id WHERE appointment_patient = $1 ORDER BY availability_date', [patient.rows[0].patient_id]);

        res.status(200).json({ message: 'OK', appointments: appointments.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.get('/appointmentDetails/:appointmentID', auth, async (req, res) => {
    try {
        const { appointmentID } = req.params;

        const appointmentDetails = await db.query('SELECT * FROM appointment appt JOIN availability av ON appt.appointment_availability = av.availability_id JOIN doctor doc on av.doctor_id = doc.doctor_id LEFT JOIN test t on doc.doctor_id = t.test_doctor LEFT JOIN diagnosis d ON d.diagnosis_id = doc.doctor_diagnosis WHERE appointment_id = $1', [appointmentID]);

        res.status(200).json({ message: 'OK', appointmentDetails: appointmentDetails.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
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

        res.status(200).json({ message: 'OK', appointments: appointments.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.get('/primaryAvailable', async (req, res) => {
    try {
        const primaryAvailable = await db.query('SELECT * FROM doctor d INNER JOIN availability a on d.doctor_id = a.doctor_id INNER JOIN office o on a.office_id = o.office_id INNER JOIN address a2 on o.office_address = a2.address_id WHERE d.doctor_primary = true AND a.availability_taken = false AND a.availability_date >= CURRENT_DATE ORDER BY availability_date, availability_from_time ASC;');
        if (primaryAvailable.rows.length === 0) {
            return res.status(201).json({ message: 'No Availability', primaryAvailable: [] });
        }

        return res.status(200).json({ message: 'OK', primaryAvailable: primaryAvailable.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.get('/specialtyAvailable', async (req, res) => {
    try {
        const specialtyAvailable = await db.query('SELECT * FROM doctor d INNER JOIN availability a on d.doctor_id = a.doctor_id INNER JOIN office o on a.office_id = o.office_id INNER JOIN address a2 on o.office_address = a2.address_id WHERE d.doctor_primary = false AND a.availability_taken = false AND a.availability_date >= CURRENT_DATE ORDER BY availability_date, availability_from_time;');

        if (specialtyAvailable.rows.length === 0) {
            return res.status(200).json({ message: 'No Availability', specialtyAvailable: [] });
        }

        return res.status(200).json({ message: 'OK', specialtyAvailable: specialtyAvailable.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.get('/currentPrimaryAppointment/:patientID', async (req, res) => {
    try {
        const { patientID } = req.params;

        const currentPrimary = await db.query('SELECT COUNT(*) FROM appointment JOIN availability on appointment_availability=availability_id WHERE appointment_patient = $1 AND availability_date >= CURRENT_DATE;', [patientID]);
        res.status(200).json({ message: 'OK', currentPrimary: currentPrimary.rows[0].count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;
