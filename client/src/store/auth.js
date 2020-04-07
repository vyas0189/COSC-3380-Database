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

    getCurrentPatient: thunk(async (action, _, { getState }) => {

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
            action.setError(err)
        }
        action.isLoading(false);
    }),

    registerPatient: thunk(async (action, { username, password, role, email, firstName, lastName, address, address2, city, state, zip, phoneNumber, dob, gender }) => {
        action.isLoading(true);
        try {
            const res = await axios.post('http://localhost:4000/api/auth/register/patient', { username, password, role, email, firstName, lastName, address, address2, city, state, zip, phoneNumber, dob, gender })

            if (res.status === 200 && res.data.message === 'OK') {
                action.setToken(res.data.token);
                action.setAuthenticated(true)
            }
        } catch (err) {
            action.setAuthenticated(false)
            action.setError(err)
        }
        action.isLoading(false);
    }),

    loginPatient: thunk(async (action, { username, password }) => {
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
            console.log(err.response);

            action.setError(err.response.data.message)
        }
        action.isLoading(false);
    }),

    logoutPatient: action(state => {
        localStorage.removeItem('token')
        state.token = null;
        state.isAuthenticated = null;
        state.loading = false;
        state.user = null;
        state.err = null;
    }),

    isLoading: action((state, loading) => {
        state.loading = loading;
    }),

    setUser: action((state, user) => {
        console.log(user);

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
    })
}

export default authModel;