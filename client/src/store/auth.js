import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { toast } from 'react-toastify';
import setAuthToken from '../utils/setAuthToken';

const authModel = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	loading: true,
	user: null,
	err: null,
	loginErr: null,
	registerErr: null,
	isAdmin: false,

	getCurrentPatient: thunk(async (action) => {
		action.setError(null)
		action.isLoading(true)
		try {
			const res = await axios.get('/api/auth/patient/me');

			if (res.status === 200) {
				action.setAuthenticated(true)
				action.setUser(res.data.user)
			}
		} catch (err) {
			action.setAuthenticated(false)
			action.setUser(null)
			action.setError(err.response.data.message)
		}
		action.isLoading(false);
	}),

	updatePatientProfile: thunk(async (action, { firstName, lastName, email, address, address2, city, state, zip, phoneNumber, dob, gender, }, { getState }) => {
		action.setError(null)
		action.setLoading(true)

		try {
			if (address2 === null || address2.length === 0) {
				address2 = 'n/a'
			}
			const res = await axios.put('/api/patient/update', { firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender })

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
			const res = await axios.get('/api/auth/doctor/me');

			if (res.status === 200) {
				action.setAuthenticated(true)
				action.setUser(res.data.user)
			}
		} catch (err) {
			action.setAuthenticated(false)
			action.setUser(null)
			action.setError(err.response.data.message)
		}
		action.isLoading(false);
	}),

	getCurrentAdmin: thunk(async (action, _, { getState }) => {
		action.setError(null)
		action.isLoading(true)
		try {
			const res = await axios.get('/api/admin/me');

			if (res.status === 200) {
				action.setAuthenticated(true)
				action.setUser(res.data.user)
			}
		} catch (err) {
			action.setAuthenticated(false)
			action.setUser(null)
			action.setError(err.response.data.message)
		}
		action.isLoading(false);
	}),

	registerPatient: thunk(async (action, { username, password, role, email, firstName, lastName, address, address2, city, state, zip, phoneNumber, dob, gender }) => {
		action.setError(null)
		action.isLoading(true);
		zip = parseInt(zip)
		try {
			if (address2 === null || address2.length === 0) {
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
			const errArr = []
			err.response.data.error.details.map(err => {
				return errArr.push(err.context.label);
			})
			action.setRegisterError(errArr.join('\n'))
			toast.error(errArr.join('\n'))
		}
		action.isLoading(false);
	}),

	loginPatient: thunk(async (action, { username, password }) => {
		action.setError(null)
		action.setLoginError(null)
		action.isLoading(true);
		try {
			const res = await axios.post('/api/auth/login/patient', { username, password });
			if (res.status === 200 && res.data.message === 'OK') {
				action.setToken(res.data.token);
				action.setAuthenticated(true);
				setAuthToken(res.data.token);
				toast.success('Logged in Successfully')
				action.getCurrentPatient()
			}
		} catch (err) {
			action.setLoginError(err.response.data.message)
			toast.error(err.response.data.message)
		}
		action.isLoading(false);
	}),

	loginDoctor: thunk(async (action, { username, password }) => {
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
		}
		action.isLoading(false);
	}),

	loginAdmin: thunk(async (action, { username, password }) => {
		action.setError(null)
		action.setLoginError(null)
		action.isLoading(true);
		try {
			const res = await axios.post('/api/admin/login', { username, password });
			if (res.status === 200 && res.data.message === 'OK') {
				action.setToken(res.data.token);
				action.setAuthenticated(true);
				action.setAdmin(true);
				setAuthToken(res.data.token);
				toast.success('Logged in Successfully')
				action.getCurrentAdmin()
			}
		} catch (err) {
			action.setLoginError(err.response.data.message);
			toast.error(err.response.data.message)
		}
		action.isLoading(false);
	}),

	logout: action(state => {
		localStorage.removeItem('token')
		state.token = null;
		state.isAuthenticated = null;
		state.loading = false;
		state.user = null;
		state.err = null;
		state.loginErr = null;
		state.loginErr = null;
		state.registerErr = null;
		state.isAdmin = false;
		toast.success('You have Successfully Logged out!', { position: toast.POSITION.TOP_CENTER })
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
	}),

	setAdmin: action((state, admin) => {
		state.isAdmin = admin;
	}),

}

export default authModel;
