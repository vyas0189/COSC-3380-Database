import { useStoreState } from 'easy-peasy';
import React from 'react';
import { Redirect } from 'react-router-dom';
import AdminDashboardComponent from '../../components/Dashboard/Admin';
import DoctorDashboardComponent from '../../components/Dashboard/Doctor';
import PatientDashboardComponent from '../../components/Dashboard/Patient';
const Dashboard = () => {

    const user = useStoreState(state => state.auth.user);
    const isLoading = useStoreState(state => state.auth.loading)
    const isAuth = useStoreState(state => state.auth.isAuthenticated)

    if (!isAuth) {
        return <Redirect to='/login' />
    } else {
        return isLoading || user === null ? <h1> Loading...</h1 > : (
            user.role === 'admin' ? <AdminDashboardComponent /> :
                user.role === 'doctor' ? <DoctorDashboardComponent />
                    : user.role === 'patient' ? <PatientDashboardComponent /> : null
        )
    }
}

export default Dashboard
