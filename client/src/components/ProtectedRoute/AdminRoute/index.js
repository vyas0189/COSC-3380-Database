import { useStoreState } from 'easy-peasy'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'


const PrivateRoute = ({ component: Component, ...rest }) => {

    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)
    const isAdmin = useStoreState(state => state.auth.isAdmin)
    console.log(isAdmin, isAuthenticated);

    return (
        <Route
            {...rest}
            render={props => isAuthenticated && isAdmin ? <Component {...props} /> : <Redirect to={'/login/admin'} />}
        />
    )
}


export default PrivateRoute
