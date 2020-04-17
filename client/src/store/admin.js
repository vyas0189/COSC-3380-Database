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

	//avgAge
	avgAge: [],
	avgAgeErr: null,
	//stateCounts
	stateCounts: [],
	stateCountErr: null,
	//newPatients
	newPatients: [],
	newPatientErr: null,

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

	getOffices: thunk(async (action, payload) => {
		action.setOfficesError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/get/offices', {
				headers: {
					jwt_token: payload,
				},
			});
			if (res.status === 200) {
				action.setOffices(res.data.offices);
			}
		} catch (error) {
			action.setOfficesError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getDoctors: thunk(async (action, payload) => {
		action.setDoctorsError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/get/doctors', {
				headers: {
					jwt_token: payload,
				},
			});
			if (res.status === 200) {
				action.setDoctors(res.data.doctors);
			}
		} catch (error) {
			action.setDoctorsError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getNewPatients: thunk(async (action, { startDate, endDate }) => {
		action.setAvgAgeError(null);
		action.setStateCountError(null);
		action.setNewPatientsError(null);
		action.setLoading(true);

		try {
			console.log(startDate, endDate);
			const res = await axios.get(
				`/api/admin/get/newPatients/${startDate}/${endDate}`
			);
			console.log(res.data);

			if (res.status === 200) {
				action.setAvgAge(res.data.avgAge);
				action.setStateCounts(res.data.stateCounts);
				action.setNewPatients(res.data.newPatients);
			}
		} catch (error) {
			action.setAvgAgeError(error.response.data.message);
			action.setStateCountError(error.response.data.message);
			action.setNewPatientsError(error.response.data.message);
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
					{ doctorID, primary, specialty, office },
					{
						headers: {
							jwt_token: getState().token,
						},
					}
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

	setNewPatients: action((state, newPatients) => {
		state.newPatients = newPatients;
	}),

	setNewPatientsError: action((state, error) => {
		state.newPatientErr = error;
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
