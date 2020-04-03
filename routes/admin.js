const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    validate, loginAdmin, registerDoctor, updateDoctorAdmin, cancelAppointmentAdmin,
} = require('../validation');
const { admin } = require('../middleware/auth');

const { JWT_SECRET, SESSION_EXPIRES = 60 * 60 } = process.env;
const db = require('../config/db');

const router = Router();

router.get('/me', admin, async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM db_user WHERE u.user_id = $1', [req.user.userID]);
        if (user.rows.length > 0) {
            return res.status(200).json({ message: 'OK', user: user.rows[0] });
        }
        return res.status(401).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        await validate(loginAdmin, req.body, req, res);
        const { username, password } = req.body;
        const user = await db.query('SELECT * FROM db_user WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const currentUser = { userID: user.rows[0].user_id, role: user.rows[0].role };

        const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

        res.status(200).json({ message: 'OK', token });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/register/doctor', admin, async (req, res) => {
    try {
        await validate(registerDoctor, req.body, req, res);
        const {
            username, password, role, firstName, lastName, email, address, city, state, zip, phoneNumber, primary, specialty, office,
        } = req.body;

        let { address2 } = req.body;

        const user = await db.query('SELECT * FROM db_user u JOIN doctor d ON u.user_id = d.doctor_id WHERE u.username = $1 OR d.doctor_email = $2',
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
        console.log(dbUser.rows[0]);

        const userAddress = await db.query('INSERT INTO address(address_name, address2_name, city, state, zip) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [address, address2, city, state, zip]);

        await db.query('INSERT INTO doctor(doctor_first_name, doctor_last_name, doctor_email, doctor_phone_number, doctor_address, doctor_primary, doctor_specialty, doctor_office, doctor_user) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [firstName, lastName, email, phoneNumber, userAddress.rows[0].address_id, primary, specialty, office, dbUser.rows[0].user_id]);

        const currentUser = { userID: dbUser.rows[0].user_id, role: dbUser.rows[0].role };

        const token = jwt.sign(currentUser, JWT_SECRET, { expiresIn: SESSION_EXPIRES });

        res.status(200).json({ message: 'OK', token });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

router.put('/update/doctor', admin, async (req, res) => {
    try {
        await validate(updateDoctorAdmin, req.body, req, res);
        const {
            doctorID, primary, specialty, office,
        } = req.body;

        const doctor = await db.query('SELECT * FROM doctor WHERE doctor_id = $1', [doctorID]);

        if (doctor.rows.length === 0) {
            return res.status(401).json({ message: 'Doctor not found.' });
        }

        await db.query('UPDATE doctor SET doctor_primary = $1, doctor_specialty = $2, doctor_office = $3 WHERE doctor_id = $4',
            [primary, specialty, office, doctorID]);

        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

router.delete('/cancel', admin, async (req, res) => {
    try {
        await validate(cancelAppointmentAdmin, req.body, req, res);
        const {
            patientID, appointmentID,
        } = req.body;

        const appointment = await db.query('SELECT * FROM appointment WHERE appointment_id = $1 AND appointment_patient = $2',
            [appointmentID, patientID]);

        if (appointment.rows.length === 0) {
            return res.status(401).json({ message: 'You do not have an appointment scheduled then.' });
        }

        // setting taken condition to false
        await db.query('UPDATE availability SET availability_taken = FALSE WHERE availability_id = $1',
            [appointment.rows[0].appointment_availability]);

        await db.query('DELETE FROM appointment WHERE appointment_id = $1 AND appointment_patient = $2',
            [appointmentID, patientID]);

        res.status(200).json({ message: 'OK - appointment deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

module.exports = router;
