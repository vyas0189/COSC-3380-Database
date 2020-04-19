import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { toast } from 'react-toastify';

const adminModel = {
	loading: false,

	//offices
	offices: [],
	officeErr: null,

	//doctors
	doctors: [],
	doctorErr: null,
	//doctorAppts
	doctorAppts: [],
	doctorApptErr: null,
	//specialtyAppts
	specialtyAppts: [],
	specialtyApptErr: null,
	//apptCount
	apptCount: [],
	apptCountErr: null,

	//newPatients
	patients: [],
	patientErr: null,
	//avgAge
	avgAge: [],
	avgAgeErr: null,
	//stateCounts
	stateCounts: [],
	stateCountErr: null,

	registerDoctor: thunk(
		async (
			action,
			{
				username,
				password,
				role,
				email,
				firstName,
				lastName,
				address,
				address2,
				city,
				state,
				zip,
				phoneNumber,
				primary,
				office,
				specialty,
			}
		) => {
			action.setDoctorsError(null);
			action.isLoading(true);
			zip = parseInt(zip);
			try {
				if (!address2.length) {
					address2 = 'n/a';
				}
				role = 'doctor';
				const res = await axios.post('/api/admin/register/doctor', {
					username,
					password,
					role,
					email,
					firstName,
					lastName,
					address,
					address2,
					city,
					state,
					zip,
					phoneNumber,
					primary,
					office,
					specialty,
				});

				if (res.status === 200 && res.data.message === 'OK') {
					toast.success('Registered Successfully');
				}
			} catch (err) {
				const errArr = [];
				err.response.data.error.details.map((err) => {
					return errArr.push(err.context.label);
				});
				action.setDoctorsError(errArr.join('\n'));
				toast.error(errArr.join('\n'));
			}
			action.isLoading(false);
		}
	),

	registerOffice: thunk(
		async (
			action,
			{ capacity, address, address2, city, state, zip, phoneNumber }
		) => {
			action.setOfficesError(null);
			action.isLoading(true);
			zip = parseInt(zip);
			try {
				if (!address2.length) {
					address2 = 'n/a';
				}

				const res = await axios.post('/api/admin/register/office', {
					capacity,
					address,
					address2,
					city,
					state,
					zip,
					phoneNumber,
				});

				if (res.status === 200 && res.data.message === 'OK') {
					action.getOffices();
					toast.success('Registered Successfully');
				}
			} catch (err) {
				const errArr = [];
				err.response.data.error.details.map((err) => {
					return errArr.push(err.context.label);
				});
				action.setDoctorsError(errArr.join('\n'));
				toast.error(errArr.join('\n'));
			}
			action.isLoading(false);
		}
	),

	getOffices: thunk(async (action) => {
		action.setOfficesError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/get/offices');
			if (res.status === 200) {
				action.setOffices(res.data.offices);
			}
		} catch (error) {
			action.setOfficesError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getDoctors: thunk(async (action) => {
		action.setDoctorsError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/get/doctors');
			if (res.status === 200) {
				action.setDoctors(res.data.doctors);
			}
		} catch (error) {
			action.setDoctorsError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getPatients: thunk(async (action, { startDate, endDate }) => {
		action.setAvgAgeError(null);
		action.setStateCountError(null);
		action.setPatientsError(null);
		action.setLoading(true);

		try {
			console.log(startDate, endDate);
			const res = await axios.get(
				`/api/admin/get/patients/${startDate}/${endDate}`
			);
			console.log(res.data);

			if (res.status === 200) {
				action.setAvgAge(res.data.avgAge);
				action.setStateCounts(res.data.stateCounts);
				action.setPatients(res.data.patients);
			}
		} catch (error) {
			action.setAvgAgeError(error.response.data.message);
			action.setStateCountError(error.response.data.message);
			action.setPatientsError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getAppointments: thunk(async (action, { startDate, endDate }) => {
		action.setDoctorsError(null);
		action.setDoctorApptError(null);
		action.setSpecialtyApptError(null);
		action.setApptCountError(null);
		action.setLoading(true);

		try {
			console.log(startDate, endDate);
			const res = await axios.get(
				`/api/admin/get/appointments/${startDate}/${endDate}`
			);
			console.log(res.data);

			if (res.status === 200) {
				action.setDoctors(res.data.doctors);
				action.setDoctorAppts(res.data.doctorAppts);
				action.setSpecialtyAppts(res.data.specialtyAppts);
				action.setApptCount(res.data.apptCount);
			}
		} catch (error) {
			action.setDoctorsError(error.response.data.message);
			action.setDoctorApptError(error.response.data.message);
			action.setSpecialtyApptError(error.response.data.message);
			action.setApptCountError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	updateDoctorProfile: thunk(
		async (
			action,
			{ doctorID, primary, specialty, office },
			{ getState }
		) => {
			action.setError(null);
			action.isLoading(true);

			try {
				const res = await axios.put(
					'/api/admin/update/doctor',
					{ doctorID, primary, specialty, office }
				);

				if (res.status === 200) {
					action.setUser(res.data.doctor);
					toast.success('Profile Updated!');
				}
			} catch (error) {
				const errArr = [];
				error.response.data.error.details.map((err) => {
					return errArr.push(err.context.label);
				});
				action.setDoctorsError(errArr.join('\n'));
				toast.error(errArr.join('\n'));
			}
			action.isLoading(false);
		}
	),

	setLoading: action((state, loading) => {
		state.loading = loading;
	}),

	setOffices: action((state, offices) => {
		state.offices = offices;
	}),

	setOfficesError: action((state, error) => {
		state.officeErr = error;
	}),

	setDoctors: action((state, doctors) => {
		state.doctors = doctors;
	}),

	setDoctorsError: action((state, error) => {
		state.doctorErr = error;
	}),

	setDoctorAppts: action((state, doctorAppts) => {
		state.doctorAppts = doctorAppts;
	}),

	setDoctorApptError: action((state, error) => {
		state.doctorApptErr = error;
	}),

	setSpecialtyAppts: action((state, specialtyAppts) => {
		state.specialtyAppts = specialtyAppts;
	}),

	setSpecialtyApptError: action((state, error) => {
		state.specialtyApptErr = error;
	}),

	setApptCount: action((state, apptCount) => {
		state.apptCount = apptCount;
	}),

	setApptCountError: action((state, error) => {
		state.ApptCountError = error;
	}),

	setPatients: action((state, patients) => {
		state.patients = patients;
	}),

	setPatientsError: action((state, error) => {
		state.patientErr = error;
	}),

	setAvgAge: action((state, avgAge) => {
		state.avgAge = avgAge;
	}),

	setAvgAgeError: action((state, error) => {
		state.avgAgeErr = error;
	}),

	setStateCounts: action((state, stateCounts) => {
		state.stateCounts = stateCounts;
	}),

	setStateCountError: action((state, error) => {
		state.stateCountErr = error;
	}),

	isLoading: action((state, loading) => {
		state.loading = loading;
	}),
};
export default adminModel;
