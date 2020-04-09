import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
	const logout = useStoreActions((actions) => actions.auth.logout);
	const isAuthenticated = useStoreState((state) => state.auth.isAuthenticated);
	const loading = useStoreState((state) => state.auth.loading);
	const user = useStoreState((state) => state.auth.user);
	const history = useHistory();

const logoutUser = () => {
        logout();
        history.push('/')
    }
    const authLinks = (
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to='/dashboard'>
                    Dashboard
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/schedule'>Schedule</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/profile'>Profile</Link>
            </li>
            <li className="nav-item">
                <i className="nav-link" onClick={logoutUser} >
                    Logout
                </i>
            </li>
        </ul>
    );

    const doctorLinks = (
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to='/dashboard'>
                    Dashboard
                </Link>
            </li>
            <li className="nav-item active">
                <Link to='/doctorProfile'>Profile</Link>
            </li>
            <li className="nav-item">
                <i className="nav-link" onClick={logoutUser} >
                    Logout
                </i>
            </li>
        </ul>
    );

    const adminLinks = (
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to='/dashboard'>
                    Dashboard
                </Link>
            </li>
            <li className="nav-item">
                <i className="nav-link" onClick={logoutUser} >
                    Logout
                </i>
            </li>
        </ul>
    )

    const guestLinks = (
        <ul className="navbar-nav ml-auto">

            <li className="nav-item">
                <Link className="nav-link" to="/">About Us
                    <span className="sr-only">(current)</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/">Contact Us</Link>
            </li>

            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-4" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    <i className="fas fa-user"></i> Profile </a>

                <div className="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4">
                    <Link className="dropdown-item" to='/login'>Login</Link>
                    <Link className="dropdown-item" to='/login/doctor'>Employee Login</Link>
                    <Link className="dropdown-item" to='/register'>Register</Link>
                </div>

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
        // <header className="navbar navbar-inverse navbar-fixed-top bs-docs-nav" role="banner">
        //     <div className="container">

        //         <div className="navbar-header">
        //             <button className="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
        //                 <span className="sr-only">Toggle navigation</span>
        //                 <span className="icon-bar"></span>
        //                 <span className="icon-bar"></span>
        //                 <span className="icon-bar"></span>
        //             </button>
        //             <Link to='/'>
        //                 <img src={logo} />
        //             </Link>
        //         </div>
        //         <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
        //             {!loading && (
        //                 <>{navLinks()}</>
        //             )}
        //         </nav>
        //     </div>
        // </header>

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <Link to='/'>
                <img src={logo} />
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-4"
                aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent-4">
                {!loading && navLinks()}
            </div>
        </nav>

    )
}


export default Navbar;
