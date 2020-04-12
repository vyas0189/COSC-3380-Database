const Joi = require('@hapi/joi');

// all users

const username = Joi.string().alphanum().min(3).max(30);
const password = Joi.string()
	.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
	.required();
const email = Joi.string()
	.email()
	.min(8)
	.max(245)
	.lowercase()
	.trim()
	.required();
const firstName = Joi.string().min(3).max(50).trim();
const lastName = Joi.string().min(3).max(50).trim();
const address = Joi.string()
	.trim()
	.regex(/^[a-z\d\s\-.,]*$/i)
	.max(100)
	.required();
const city = Joi.string().trim().required();
const state = Joi.string().min(2).required();
const zip = Joi.number().min(4).required();
const role = Joi.string().required();
const address2 = Joi.string().trim();
const phoneNumber = Joi.string()
	.trim()
	.regex(/^[0-9]{7,10}$/)
	.required();

// patient schema

const gender = Joi.string()
	.max(1)
	.regex(/^[mfoMFO]$/)
	.required(); // o is for other
const dob = Joi.date().required();
const patientID = Joi.string().guid().required();

// doctor schema

const primary = Joi.boolean().required();
const specialty = Joi.string().max(20).required();
const office = Joi.string().guid().required();
const doctorID = Joi.string().guid().required();
// const doctorEmail = Joi.string().email().min(8).max(245)
//     .lowercase()
//     .trim()
//     .required();

// appointment schema

// const date = Joi.date().required();

// const endTime = Joi.string().regex(/^(1[0-2]|0?[1-9]):([0-5][0-9])([ ])([AaPp][Mm])$/).required();
const primaryAppointment = Joi.boolean().required();
const reason = Joi.string().required();
const availabilityID = Joi.string().guid().required();
const appointmentID = Joi.string().guid().required();

// test schema

const scan = Joi.boolean().required();
const physical = Joi.boolean().required();
const blood = Joi.boolean().required();

// diagnosis schema

const symptoms = Joi.string().required();
const condition = Joi.string().required();

// office schema

const capacity = Joi.number().required();

// report schema

const weekStartDate = Joi.date().required();
const weekEndDate = Joi.date().required();

module.exports = {
	// validate: async (schema, payload, req, res) => {
	// 	try {
	// 		await schema.validateAsync(payload, { abortEarly: false });
	// 	} catch (e) {
	// 		return res.status(500).json({ message: 'Unable to validate', e });
	// 	}
	// },

	// admin schemas

	registerAdmin: Joi.object().keys({
		username,
		password,
		role,
	}),
	loginAdmin: Joi.object().keys({
		username,
		password,
	}),
	registerDoctor: Joi.object().keys({
		username,
		password,
		role,
		firstName,
		lastName,
		email,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
		primary,
		specialty,
		office,
	}),
	updateDoctorAdmin: Joi.object().keys({
		doctorID,
		primary,
		specialty,
		office,
	}),
	cancelAppointmentAdmin: Joi.object().keys({
		patientID,
		appointmentID,
	}),
	registerOffice: Joi.object().keys({
		capacity,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
	}),
	generateWeeklyReport: Joi.object().keys({
		weekStartDate,
		weekEndDate,
	}),

	// patient schemas

	registerPatient: Joi.object().keys({
		username,
		password,
		role,
		firstName,
		lastName,
		email,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
		dob,
		gender,
	}),
	loginPatient: Joi.object().keys({
		username,
		password,
	}),
	updatePatient: Joi.object().keys({
		firstName,
		lastName,
		email,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
		dob,
		gender,
	}),

	// doctor schemas

	loginDoctor: Joi.object().keys({
		username,
		password,
	}),
	updateDoctor: Joi.object().keys({
		firstName,
		lastName,
		email,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
		office,
	}),
	updateDiagnosis: Joi.object().keys({
		patientID,
		symptoms,
		condition,
	}),
	orderTest: Joi.object().keys({
		patientID,
		scan,
		physical,
		blood,
	}),

	// appointment schemas

	schedulePrimaryAppointment: Joi.object().keys({
		primaryAppointment,
		reason,
		availabilityID,
	}),
	scheduleSpecialistAppointment: Joi.object().keys({
		primaryAppointment,
		reason,
		availabilityID,
	}),
	viewAppointmentsWithPatient: Joi.object().keys({
		patientID,
	}),
	cancelAppointment: Joi.object().keys({
		appointmentID,
	}),
};
