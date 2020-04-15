import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { toast } from 'react-toastify';
import setAuthToken from '../utils/setAuthToken';

const authModel = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	loading: false,
	user: null,
	err: null,
	loginErr: null,
	registerErr: null,
<<<<<<< HEAD
	isAdmin: false,

	getCurrentPatient: thunk(async (action, _, { getState }) => {
		action.setError(null);
		action.isLoading(true);
		try {
			const res = await axios.get('/api/auth/patient/me', {
				headers: {
					jwt_token: getState().token,
				},
			});

			if (res.status === 200) {
				action.setAuthenticated(true);
				action.setUser(res.data.user);
			}
		} catch (err) {
			action.setAuthenticated(false);
			action.setUser(null);
			action.setError(err.response.data.message);
=======

	getCurrentPatient: thunk(async (action, _, { getState }) => {
		action.setError(null)
		action.isLoading(true)
		try {
			const res = await axios.get('/api/auth/patient/me', {
				headers: {
					'jwt_token': getState().token
				}
			});

			if (res.status === 200) {
				action.setAuthenticated(true)
				action.setUser(res.data.user)
			}
		} catch (err) {
			action.setAuthenticated(false)
			action.setUser(null)
			action.setError(err.response.data.message)
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		}
		action.isLoading(false);
	}),

<<<<<<< HEAD
	updatePatientProfile: thunk(
		async (
			action,
			{
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
			},
			{ getState }
		) => {
			action.setError(null);
			action.isLoading(true);

			try {
				if (!address2.length) {
					address2 = 'n/a';
				}
				const res = await axios.put(
					'/api/patient/update',
					{
						firstName,
						lastName,
						email,
						address,
						city,
						state,
						zip,
						phoneNumber,
						dob,
						gender,
					},
					{
						headers: {
							jwt_token: getState().token,
						},
					}
				);

				if (res.status === 200) {
					action.setUser(res.data.patient);
					toast.success('Profile Updated!');
				}
			} catch (error) {
				action.setError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

	getCurrentDoctor: thunk(async (action, _, { getState }) => {
		action.setError(null);
		action.isLoading(true);
		try {
			const res = await axios.get('/api/auth/doctor/me', {
				headers: {
					jwt_token: getState().token,
				},
			});

			if (res.status === 200) {
				action.setAuthenticated(true);
				action.setUser(res.data.user);
			}
		} catch (err) {
			action.setAuthenticated(false);
			action.setUser(null);
			action.setError(err.response.data.message);
=======
	updatePatientProfile: thunk(async (action, { firstName, lastName, email, address, address2, city, state, zip, phoneNumber, dob, gender, }, { getState }) => {
		action.setError(null)
		action.setLoading(true)

		try {
			if (!address2.length) {
				address2 = 'n/a'
			}
			const res = await axios.put('/api/patient/update', { firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender }, {
				headers: {
					'jwt_token': getState().token
				}
			})

			if (res.status === 200) {
				action.setUser(res.data.patient)
				toast.success('Profile Updated!')
			}
		} catch (error) {
			action.setError(error.response.data.message)
			toast.error(error.response.data.message)
		}
		action.isLoading(false);
	}),

	getCurrentDoctor: thunk(async (action, _, { getState }) => {
		action.setError(null)
		action.isLoading(true)
		try {
			const res = await axios.get('/api/auth/doctor/me', {
				headers: {
					'jwt_token': getState().token
				}
			});

			if (res.status === 200) {
				action.setAuthenticated(true)
				action.setUser(res.data.user)
			}
		} catch (err) {
			action.setAuthenticated(false)
			action.setUser(null)
			action.setError(err.response.data.message)
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		}
		action.isLoading(false);
	}),

	getCurrentAdmin: thunk(async (action, _, { getState }) => {
<<<<<<< HEAD
		action.setError(null);
		action.isLoading(true);
		try {
			const res = await axios.get('/api/admin/me', {
				headers: {
					jwt_token: getState().token,
				},
			});

			if (res.status === 200) {
				action.setAuthenticated(true);
				action.setUser(res.data.user);
			}
		} catch (err) {
			action.setAuthenticated(false);
			action.setUser(null);
			action.setError(err.response.data.message);
=======
		action.setError(null)
		action.isLoading(true)
		try {
			const res = await axios.get('/api/admin/me', {
				headers: {
					'jwt_token': getState().token
				}
			});

			if (res.status === 200) {
				action.setAuthenticated(true)
				action.setUser(res.data.user)
			}
		} catch (err) {
			action.setAuthenticated(false)
			action.setUser(null)
			action.setError(err.response.data.message)
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		}
		action.isLoading(false);
	}),

<<<<<<< HEAD
	registerPatient: thunk(
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
				dob,
				gender,
			}
		) => {
			action.setError(null);
			action.isLoading(true);
			zip = parseInt(zip);
			try {
				if (!address2.length) {
					address2 = 'n/a';
				}
				role = 'patient';
				const res = await axios.post('/api/auth/register/patient', {
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
					dob,
					gender,
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

	

	

	loginPatient: thunk(async (action, { username, password }) => {
		action.setError(null);
		action.setLoginError(null);
		action.isLoading(true);
		action.setAdmin(false)

		try {
			const res = await axios.post('/api/auth/login/patient', {
				username,
				password,
			});
=======
	registerPatient: thunk(async (action, { username, password, role, email, firstName, lastName, address, address2, city, state, zip, phoneNumber, dob, gender }) => {
		action.setError(null)
		action.isLoading(true);
		zip = parseInt(zip)
		try {
			if (!address2.length) {
				address2 = 'n/a'
			}
			role = 'patient';
			const res = await axios.post('/api/auth/register/patient', { username, password, role, email, firstName, lastName, address, address2, city, state, zip, phoneNumber, dob, gender })

			if (res.status === 200 && res.data.message === 'OK') {
				action.setToken(res.data.token);
				setAuthToken(res.data.token);
				action.setAuthenticated(true)
				action.getCurrentPatient()
				toast.success('Registered Successfully')

			}
		} catch (err) {
			action.setRegisterError(err.response.data.message)
			toast.error(err.response.data.message)
		}
		action.isLoading(false);
	}),

	loginPatient: thunk(async (action, { username, password }) => {
		action.setError(null)
		action.setLoginError(null)
		action.isLoading(true);
		try {
			const res = await axios.post('/api/auth/login/patient', { username, password });
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
			if (res.status === 200 && res.data.message === 'OK') {
				action.setToken(res.data.token);
				action.setAuthenticated(true);
				setAuthToken(res.data.token);
<<<<<<< HEAD
				toast.success('Logged in Successfully');
				action.setAdmin(false)
				action.getCurrentPatient();
			}
		} catch (err) {
			action.setLoginError(err.response.data.message);
			toast.error(err.response.data.message);
=======
				toast.success('Logged in Successfully')
				action.getCurrentPatient()
			}
		} catch (err) {
			action.setLoginError(err.response.data.message)
			toast.error(err.response.data.message)
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		}
		action.isLoading(false);
	}),

	loginDoctor: thunk(async (action, { username, password }) => {
<<<<<<< HEAD
		action.setError(null);
		action.setLoginError(null);
		action.isLoading(true);
		action.setAdmin(false)
		try {
			const res = await axios.post('/api/auth/login/doctor', {
				username,
				password,
			});
			if (res.status === 200 && res.data.message === 'OK') {
				action.setAdmin(false)
				action.setToken(res.data.token);
				action.setAuthenticated(true);
				setAuthToken(res.data.token);
				toast.success('Logged in Successfully');
				action.getCurrentDoctor();
			}
		} catch (err) {
			action.setLoginError(err.response.data.message);
			toast.error(err.response.data.message);
=======
		action.setError(null)
		action.setLoginError(null)
		action.isLoading(true);
		try {
			const res = await axios.post('/api/auth/login/doctor', { username, password });
			if (res.status === 200 && res.data.message === 'OK') {
				action.setToken(res.data.token);
				action.setAuthenticated(true);
				setAuthToken(res.data.token);
				toast.success('Logged in Successfully')
				action.getCurrentDoctor()
			}
		} catch (err) {
			action.setLoginError(err.response.data.message)
			toast.error(err.response.data.message)
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		}
		action.isLoading(false);
	}),

	loginAdmin: thunk(async (action, { username, password }) => {
<<<<<<< HEAD
		action.setError(null);
		action.setLoginError(null);
		action.isLoading(true);
		action.setAdmin(false)

		try {
			const res = await axios.post('/api/admin/login', {
				username,
				password,
			});
=======
		action.setError(null)
		action.setLoginError(null)
		action.isLoading(true);
		try {
			const res = await axios.post('/api/admin/login', { username, password });
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
			if (res.status === 200 && res.data.message === 'OK') {
				action.setToken(res.data.token);
				action.setAuthenticated(true);
				setAuthToken(res.data.token);
<<<<<<< HEAD
				toast.success('Logged in Successfully');
				action.setAdmin(true)
				action.getCurrentAdmin();
			}
		} catch (err) {
			action.setLoginError(err.response.data.message);
			toast.error(err.response.data.message);
=======
				toast.success('Logged in Successfully')
				action.getCurrentAdmin()
			}
		} catch (err) {
			action.setLoginError(err.response.data.message);
			toast.error(err.response.data.message)
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		}
		action.isLoading(false);
	}),

<<<<<<< HEAD
	logout: action((state) => {
		localStorage.removeItem('token');
=======
	logout: action(state => {
		localStorage.removeItem('token')
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
		state.token = null;
		state.isAuthenticated = null;
		state.loading = false;
		state.user = null;
		state.err = null;
		state.loginErr = null;
		state.loginErr = null;
		state.registerErr = null;
<<<<<<< HEAD
		state.isAdmin = false;
		toast.success('You have Successfully Logged out!', {
			position: toast.POSITION.TOP_CENTER,
		});
=======
		toast.success('You have Successfully Logged out!', { position: toast.POSITION.TOP_CENTER })
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
	}),

	isLoading: action((state, loading) => {
		state.loading = loading;
	}),

	setUser: action((state, user) => {
		state.user = user;
	}),

	setToken: action((state, token) => {
		state.token = token;
	}),
	setAuthenticated: action((state, authenticated) => {
		state.isAuthenticated = authenticated;
	}),

	setError: action((state, error) => {
		state.err = error;
	}),

	setLoginError: action((state, error) => {
		state.loginErr = error;
	}),

	setRegisterError: action((state, error) => {
		state.registerErr = error;
<<<<<<< HEAD
	}),

	setAdmin: action((state, isAdmin) => {
		state.isAdmin = isAdmin;
	})
};

export default authModel;
=======
	})

}

export default authModel;
>>>>>>> ad822ac373e23a780f384f66ad9affcb1e568fb5
