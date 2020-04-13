import { useStore } from 'easy-peasy'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'


const PrivateRoute = ({ component: Component, ...rest }) => {

    const isAuthenticated = useStore(state => state.auth.isAuthenticated)
    const isAdmin = useStore(state => state.auth.isAdmin)
    return (
        <Route
            {...rest}
            render={props => isAuthenticated && isAdmin ? <Component {...props} /> : <Redirect to={'/login/admin'} />}
        />
    )
}


export default PrivateRoute
