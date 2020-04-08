const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { updatePatient } = require('../validation');

// registerPatient
const router = Router();
const db = require('../config/db');

router.put('/update', auth, async (req, res) => {
    try {
        await updatePatient.validateAsync(req.body, { abortEarly: false });
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

module.exports = router;
