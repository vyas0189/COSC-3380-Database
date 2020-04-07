import { useStoreState } from 'easy-peasy'
import React from 'react'
import { Redirect } from 'react-router-dom'
import LoginComponent from '../../components/Auth/Login'

const Login = () => {

    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)

    return isAuthenticated ? <Redirect to='/dashboard' /> : <LoginComponent />



}

export default Login
