const Joi = require('@hapi/joi');

// all users

const username = Joi.string()
	.alphanum()
	.min(3)
	.max(30)
	.label('Please Enter valid Username.');
const password = Joi.string()
	.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
	.required()
	.label(
		'Password must have minimum 6 characters, Minimum 1 special characters, Minimum 1 uppercase letter.'
	);
const email = Joi.string()
	.email()
	.min(8)
	.max(245)
	.lowercase()
	.trim()
	.required()
	.label('Please Enter valid Email.');
const firstName = Joi.string()
	.min(3)
	.max(50)
	.trim()
	.label('Please Enter valid First Name.');
const lastName = Joi.string()
	.min(2)
	.max(50)
	.trim()
	.label('Please Enter valid Last Name.');
const address = Joi.string()
	.trim()
	.regex(/^[a-z\d\s\-.,]*$/i)
	.max(100)
	.required()
	.label('Please Enter valid Address.');
const city = Joi.string().trim().required().label('Please Enter valid City.');
const state = Joi.string().min(2).required().label('Please Enter valid State.');
const zip = Joi.number()
	.min(4)
	.required()
	.label('Please Enter valid Zip Code.');
const role = Joi.string().required().label('Please Enter valid Role.');
const address2 = Joi.string()
	.trim()
	.label('Please Enter valid Secondary Address.');
const phoneNumber = Joi.string()
	.trim()
	.regex(/^[0-9]{7,10}$/)
	.required()
	.label('Please Enter valid Phone Number.');

// patient schema

const gender = Joi.string()
	.max(1)
	.regex(/^[mfoMFO]$/)
	.required()
	.label('Please Enter valid Gender.'); // o is for other
const dob = Joi.date().required().label('Please Enter valid Date of Birth.');
const patientID = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Patient ID.');

// doctor schema

const primary = Joi.boolean().required().label('Please Enter valid Primary.');
const specialty = Joi.string()
	.max(20)
	.required()
	.label('Please Enter valid Specialty.');
const office = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Office.');
const doctorID = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Doctor ID.');
const availabilityDate = Joi.date()
	.required()
	.label('Please Enter valid Availability Date.');
const officeID = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Office ID.');
const taken = Joi.boolean().required().label('Please Enter valid Taken.');

// appointment schema

const primaryAppointment = Joi.boolean()
	.required()
	.label('Please Enter valid Primary Appointment.');
const reason = Joi.string().required().label('Please Enter valid Reason.');
const availabilityID = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Availability ID.');
const appointmentID = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Appointment ID.');

// test schema

const scan = Joi.boolean().required().label('Please Enter valid Scan.');
const physical = Joi.boolean().required().label('Please Enter valid Physical.');
const blood = Joi.boolean().required().label('Please Enter valid Blood.');

// diagnosis schema

const diagnosisID = Joi.string()
	.guid()
	.required()
	.label('Please Enter valid Patient ID.');

// office schema

const capacity = Joi.number().required().label('Please Enter valid Capacity.');

// report schema

const startDate = Joi.date().required().label('Please Enter valid Start Date.');
const endDate = Joi.date().required().label('Please Enter valid End Date.');

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
	generateReport: Joi.object().keys({
		startDate,
		endDate,
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
		diagnosisID,
	}),
	orderTest: Joi.object().keys({
		patientID,
		scan,
		physical,
		blood,
	}),
	addAvailability: Joi.object().keys({
		officeID,
		availabilityDate,
	}),
	updateAvailability: Joi.object().keys({
		availabilityID,
		taken,
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
