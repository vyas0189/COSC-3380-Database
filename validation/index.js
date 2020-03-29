const Joi = require('@hapi/joi');


const username = Joi.string().alphanum().min(3).max(30);
const password = Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).required();
const email = Joi.string().email().min(8).max(245)
    .lowercase()
    .trim()
    .required();

const firstName = Joi.string().min(3).max(50).trim();
const lastName = Joi.string().min(3).max(50).trim();
const address = Joi
    .string()
    .trim()
    .regex(/^[a-z\d\s\-.,]*$/i)
    .max(100)
    .required();

const city = Joi.string().trim().required();
const state = Joi.string().min(2).required();
const zip = Joi.number().min(4).required();
const role = Joi.string().required();
const address2 = Joi.string().trim();
const phoneNumber = Joi.string().trim().regex(/^[0-9]{7,10}$/).required();
const gender = Joi.string().max(1).regex(/^[mfoMFO]$/).required(); // o is for other
const dob = Joi.string().trim().regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/).required();

const primary = Joi.boolean().required();
const specialty = Joi.string().max(20).required();
const office = Joi.string().guid().required();


module.exports = {
    validate: async (schema, payload, req, res) => {
        try {
            await schema.validateAsync(payload, { abortEarly: false });
        } catch (e) {
            return res.status(500).json({ message: 'Unable to validate', e });
        }
    },
    registerPatientSchema: Joi.object().keys({
        username, password, role, firstName, lastName, email, address, address2, city, state, zip, phoneNumber, dob, gender,
    }),
    updatePatientSchema: Joi.object().keys({
        username, password, role, firstName, lastName, email, address, address2, city, state, zip, phoneNumber, dob, gender,
    }),
    registerDoctorSchema: Joi.object().keys({
        username, password, role, firstName, lastName, email, address, address2, city, state, zip, phoneNumber, primary, specialty, office,
    }),
    updateDoctorSchema: Joi.object().keys({
        username, password, role, firstName, lastName, email, address, address2, city, state, zip, phoneNumber, primary, specialty, office,
    }),
    loginPatientSchema: Joi.object().keys({
        username, password,
    }),
};
