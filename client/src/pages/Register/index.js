import { useStoreState } from 'easy-peasy'
import React from 'react'
import { Redirect } from 'react-router-dom'
import RegisterComponent from '../../components/Auth/Patient/Register'

const Register = () => {

    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)

    return isAuthenticated ? <Redirect to='/dashboard' /> : <RegisterComponent />



}

export default Register
