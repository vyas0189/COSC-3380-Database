const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { updateDoctorSchema, validate } = require('../validation');

const router = Router();
const db = require('../config/db');

router.put('/update', auth, async (req, res) => {
    try {
        await validate(updateDoctorSchema, req.body, req, res);
        const {
            firstName, lastName, email, address, address2, city, state, zip, phoneNumber, primary, specialty, office,
        } = req.body;

        let { address2 } = req.body;
        const { userID } = req.user;
        const user = await db.query('SELECT user_id FROM db_user WHERE user_id = $1', [userID]);

        if (!user.rows.length) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (address2 === 'n/a' || address2 === 'N/A') {
            address2 = null;
        }

        // _ UPDATE ADDRESS TABLE
        const doctorAddressID = await db.query('SELECT doctor_address FROM doctor WHERE doctor_user = $1',
            [userID]);

        console.log(doctorAddressID.rows[0]);

        await db.query('UPDATE address SET address_name = $1, address2_name = $2, city = $3, state = $4, zip = $5 WHERE address_id = $6',
            [address, address2, city, state, zip, doctorAddressID.rows[0].doctor_address]);

        // UPDATE PATIENT TABLE
        await db.query('UPDATE patient SET doctor_first_name = $1, doctor_last_name = $2, doctor_email = $3, doctor_phone_number = $4, doctor_primary = $5, doctor_specialty = $6, doctor_office = $7 WHERE doctor_user = $8',
            [firstName, lastName, email, phoneNumber, primary, specialty, office, userID]);

        res.status(200).json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
});

module.exports = router;
