import { useStoreState } from 'easy-peasy';
import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import AdminLoginComponent from '../../components/Auth/Admin/Login';
import DoctorLoginComponent from '../../components/Auth/Doctor/Login';
import LoginComponent from '../../components/Auth/Patient/Login';
import Loading from '../../components/Loading';

const Login = () => {

    const location = useLocation()
    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)
    const loading = useStoreState((state) => state.auth.loading);


    if (isAuthenticated) {
        return loading ? <Loading /> : <Redirect to='/dashboard' />
    }
    if (location.pathname === '/login/doctor') {
        return loading ? <Loading /> : <DoctorLoginComponent />
    } else if (location.pathname === '/login/admin') {
        return loading ? <Loading /> : <AdminLoginComponent />
    } else {
        return loading ? <Loading /> : <LoginComponent />
    }


}

export default Login
