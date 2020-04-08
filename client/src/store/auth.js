import axios from 'axios';
import { action, thunk } from "easy-peasy";
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

    getCurrentPatient: thunk(async (action, _, { getState }) => {
        action.setError(null)
        action.isLoading(true)
        try {
            const res = await axios.get('http://localhost:4000/api/auth/patient/me', {
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
        }
        action.isLoading(false);
    }),

    getCurrentDoctor: thunk(async (action, _, { getState }) => {
        action.setError(null)
        action.isLoading(true)
        try {
            const res = await axios.get('http://localhost:4000/api/auth/doctor/me', {
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
        }
        action.isLoading(false);
    }),

    getCurrentAdmin: thunk(async (action, _, { getState }) => {
        action.setError(null)
        action.isLoading(true)
        try {
            const res = await axios.get('http://localhost:4000/api/admin/me', {
                headers: {
                    'jwt_token': getState().token
                }
            });

            if (res.status === 200) {
                action.setAuthenticated(true)
                console.log(res.data);

                action.setUser(res.data.user)
            }
        } catch (err) {
            action.setAuthenticated(false)
            action.setUser(null)
            action.setError(err.response.data.message)
        }
        action.isLoading(false);
    }),

    registerPatient: thunk(async (action, { username, password, role = 'patient', email, firstName, lastName, address, address2 = 'n/a', city, state, zip, phoneNumber, dob, gender }) => {
        action.setError(null)
        action.isLoading(true);
        zip = parseInt(zip)
        try {
            const res = await axios.post('http://localhost:4000/api/auth/register/patient', { username, password, role, email, firstName, lastName, address, address2, city, state, zip, phoneNumber, dob, gender })

            if (res.status === 200 && res.data.message === 'OK') {
                action.setToken(res.data.token);
                action.setAuthenticated(true)
                action.getCurrentPatient()

            }
        } catch (err) {
            action.setRegisterError(err.response.data.message)
        }
        action.isLoading(false);
    }),

    loginPatient: thunk(async (action, { username, password }) => {
        action.setError(null)
        action.setLoginError(null)
        action.isLoading(true);
        try {
            const res = await axios.post('http://localhost:4000/api/auth/login/patient', { username, password });
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
            const res = await axios.post('http://localhost:4000/api/auth/login/doctor', { username, password });
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
            const res = await axios.post('http://localhost:4000/api/auth/login/doctor', { username, password });
            if (res.status === 200 && res.data.message === 'OK') {
                action.setToken(res.data.token);
                action.setAuthenticated(true);
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
    })

}

export default authModel;