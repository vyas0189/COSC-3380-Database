const Joi = require('@hapi/joi');

// all users

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

// patient schema
const gender = Joi.string().max(1).regex(/^[mfoMFO]$/).required(); // o is for other
const dob = Joi.string().trim().regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/).required();

// doctor schema
const primary = Joi.boolean().required();
const primaryAppointment = Joi.boolean().required;
const specialty = Joi.string().max(20).required();
const office = Joi.string().guid().required();

// appointment schema
const firstAppointment = Joi.boolean().required();
const date = Joi.string().regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/).required();
const startTime = Joi.string().regex(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/).required();
const endTime = Joi.string().regex(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/).required();
const reason = Joi.string().required();

// test schema
const scan = Joi.boolean().required();
const physical = Joi.boolean().required();
const blood = Joi.boolean().required();

// diagnosis schema
const symptoms = Joi.string().required();
const condition = Joi.string().required();

module.exports = {
    validate: async (schema, payload, req, res) => {
        try {
            await schema.validateAsync(payload, { abortEarly: false });
        } catch (e) {
            return res.status(500).json({ message: 'Unable to validate', e });
        }
    },

    // patient schemas
    registerPatientSchema: Joi.object().keys({
        username, password, role, firstName, lastName, email, address, address2, city, state, zip, phoneNumber, dob, gender,
    }),
    loginPatientSchema: Joi.object().keys({
        username, password,
    }),
    updatePatientSchema: Joi.object().keys({
        firstName, lastName, email, address, address2, city, state, zip, phoneNumber, dob, gender,
    }),
    schedulePrimaryAppointment: Joi.object().keys({
        date, startTime, endTime, primaryAppointment, reason,
    }),
    scheduleSpecialistAppointment: Joi.object().keys({
        date, startTime, endTime, specialty, primaryAppointment, reason,
    }),
    chooseDoctor: Joi.object().keys({
        firstName, lastName,
    }),
    cancelAppointment: Joi.object().keys({
        date,
    }),

    // doctor scehmas
    registerDoctorSchema: Joi.object().keys({
        username, password, role, firstName, lastName, email, address, address2, city, state, zip, phoneNumber, primary, specialty, office,
    }),
    loginDoctorSchema: Joi.object().keys({
        username, password,
    }),
    updateDoctorSchema: Joi.object().keys({
        firstName, lastName, email, address, address2, city, state, zip, phoneNumber, office,
    }),
    viewAppointmentsWithPatient: Joi.object().keys({
        firstName, lastName, dob,
    }),
    updateDiagnosis: Joi.object().keys({
        firstName, lastName, dob, symptoms, condition,
    }),
    orderTest: Joi.object().keys({
        firstName, lastName, dob, date, scan, physical, blood,
    }),

};
