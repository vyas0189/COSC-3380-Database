import { useStoreState } from 'easy-peasy'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import Loading from '../../Loading'


const PrivateRoute = ({ component: Component, ...rest }) => {

    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)
    const loading = useStoreState(state => state.auth.loading)

    return (
        <Route
            {...rest}
            render={props => loading ? <Loading /> : isAuthenticated ? <Component {...props} /> : <Redirect to={'/login'} />}
        />
    )
}


export default PrivateRoute