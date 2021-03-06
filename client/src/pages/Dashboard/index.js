import { useStoreState } from 'easy-peasy';
import React from 'react';
import { Redirect } from 'react-router-dom';
import AdminDashboardComponent from '../../components/Dashboard/Admin';
import DoctorDashboardComponent from '../../components/Dashboard/Doctor';
import PatientDashboardComponent from '../../components/Dashboard/Patient';
import Loading from '../../components/Loading';

const Dashboard = () => {
    const user = useStoreState(state => state.auth.user);
    const isLoading = useStoreState(state => state.auth.loading)
    const isAuth = useStoreState(state => state.auth.isAuthenticated)

    if (!isAuth) {
        return <Redirect to='/login' />
    } else {
        return isLoading || !user ? <Loading /> : (
            !isLoading && user.role === 'admin' ? <AdminDashboardComponent /> :
                !isLoading && user.role === 'doctor' ? <DoctorDashboardComponent />
                    : !isLoading && user.role === 'patient' ? <PatientDashboardComponent /> : null
        )
    }
}

export default Dashboard
