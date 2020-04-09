import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const Navbar = () => {
    const logout = useStoreActions(actions => actions.auth.logout);
    const isAuthenticated = useStoreState(state => state.auth.isAuthenticated)
    const loading = useStoreState(state => state.auth.loading)
    const user = useStoreState(state => state.auth.user)
    const history = useHistory();

    const logoutUser = () => {
        logout();
        history.push('/')
    }
    const authLinks = (
        <ul>
            <li>
                <Link to='/dashboard'>
                    Dashboard
                </Link>
            </li>
            <li>
                <Link to='/schedule'>Schedule</Link>
            </li>
            <li>
                <Link to='/profile'>Profile</Link>
            </li>
            <li>
                <i onClick={logoutUser} >
                    Logout
                </i>
            </li>
        </ul>
    );

    const doctorLinks = (
        <ul>
            <li>
                <Link to='/doctorProfile'>Profile</Link>
            </li>
            <li>
                <i onClick={logoutUser} >
                    Logout
                </i>
            </li>
        </ul>
    );

    const adminLinks = (
        <ul>
            <li>
                <Link to='/doctorProfile'>Profile</Link>
            </li>
            <li>
                <i onClick={logoutUser} >
                    Logout
                </i>
            </li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </ul>
    );

    const navLinks = () => {
        if (isAuthenticated) {
            if (user) {
                console.log(user.role);

                if (user.role === 'patient') {
                    return authLinks
                } else if (user.role === 'doctor') {
                    return doctorLinks
                } else if (user.role === 'admin') {
                    return adminLinks;
                }
            }
        }
        return guestLinks
    }
    return (
        <nav className='navbar bg-dark'>
            <h1>
                <Link to='/'>
                    <i className='fas fa-code' /> Hospital
                </Link>
            </h1>
            {!loading && (
                <>{navLinks()}</>
            )}
        </nav>
    )
}

export default Navbar
