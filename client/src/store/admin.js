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
	//newUsers
	newUsers: [],
	newUserErr: null,
	//updatedUsers
	updatedUsers: [],
	updatedUserErr: null,

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
			action.setError(null);
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
					action.setToken(res.data.token);
					setAuthToken(res.data.token);
					action.setAuthenticated(true);
					toast.success('Registered Successfully');
				}
			} catch (err) {
				action.setRegisterError(err.response.data.message);
				toast.error(err.response.data.message);
			}
			action.isLoading(false);
		}
	),

	registerOffice: thunk(
		async (
			action,
			{ capacity, address, address2, city, state, zip, phoneNumber }
		) => {
			action.setError(null);
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
					action.setToken(res.data.token);
					setAuthToken(res.data.token);
					action.setAuthenticated(true);
					toast.success('Registered Successfully');
				}
			} catch (err) {
				action.setRegisterError(err.response.data.message);
				toast.error(err.response.data.message);
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

	getNewUsers: thunk(async (action, payload) => {
		action.setNewUsersError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/get/newUsers', {
				headers: {
					jwt_token: payload,
				},
			});
			if (res.status === 200) {
				action.setNewUsers(res.data.newUsers);
			}
		} catch (error) {
			action.setNewUsersError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getUpdatedUsers: thunk(async (action, payload) => {
		action.setUpdatedUsersError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/get/updatedUsers', {
				headers: {
					jwt_token: payload,
				},
			});
			if (res.status === 200) {
				action.setUpdatedUsers(res.data.updatedUsers);
			}
		} catch (error) {
			action.setUpdatedUsersError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	addAvailability: thunk(
		async (
			action,
			{ officeID, availabilityDate },
			{ getState }
		) => {
			action.setError(null);
			action.isLoading(true);

			try {
				const res = await axios.put(
					'/api/doctor/add/availability',
					{ officeID, availabilityDate },
					{
						headers: {
							jwt_token: getState().token,
						},
					}
				);

				if (res.status === 200) {
					action.setUser(res.data.doctor);
					toast.success('Availability added!');
				}
			} catch (error) {
				action.setError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

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
				action.setError(error.response.data.message);
				toast.error(error.response.data.message);
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

	setNewUsers: action((state, newUsers) => {
		state.newUsers = newUsers;
	}),

	setNewUsersError: action((state, error) => {
		state.newUserErr = error;
	}),

	setUpdatedUsers: action((state, updatedUsers) => {
		state.updatedUsers = updatedUsers;
	}),

	setUpdatedUsersError: action((state, error) => {
		state.updatedUserErr = error;
	}),
};
export default adminModel;
