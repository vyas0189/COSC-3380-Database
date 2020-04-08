import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import AdminLoginComponent from '../../components/Auth/Admin/Login';
import DoctorLoginComponent from '../../components/Auth/Doctor/Login';
import LoginComponent from '../../components/Auth/Patient/Login';

const Login = () => {

    const location = useLocation()
    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)
    const admin = useStoreActions(action => action.auth.getCurrentAdmin)
    console.log(admin());

    // return isAuthenticated ? <Redirect to='/dashboard' /> 
    if (isAuthenticated) {
        return <Redirect to='/dashboard' />
    }
    if (location.pathname === '/login/doctor') {
        return <DoctorLoginComponent />
    } else if (location.pathname === '/login/admin') {
        return <AdminLoginComponent />
    } else {
        return <LoginComponent />
    }


}

export default Login
