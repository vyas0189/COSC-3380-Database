import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

const NavbarComponent = () => {
	const logout = useStoreActions((actions) => actions.auth.logout);
	const isAuthenticated = useStoreState((state) => state.auth.isAuthenticated);
	const loading = useStoreState((state) => state.auth.loading);
	const user = useStoreState((state) => state.auth.user);
	const history = useHistory();

	const logoutUser = () => {
		logout();
		history.push('/');
	};
	const authLinks = (
		<ul className="navbar-nav ml-auto">
			<li className="nav-item">
				<Link className="nav-link" to="/dashboard">
					Dashboard
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/schedule">
					Schedule
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/profile">
					Profile
				</Link>
			</li>
			<li className="nav-item">
				<i className="nav-link" onClick={logoutUser}>
					Logout
				</i>
			</li>
		</ul>
	);

	const doctorLinks = (
		<ul className="navbar-nav ml-auto">
			<li className="nav-item">
				<Link className="nav-link" to="/dashboard">
					Dashboard
				</Link>
			</li>
			<li className="nav-item active">
				<Link className="nav-link" to="/doctorProfile">
					Profile
				</Link>
			</li>
			<li className="nav-item">
				<i className="nav-link" onClick={logoutUser}>
					Logout
				</i>
			</li>
		</ul>
	);

	const adminLinks = (
		<ul className="navbar-nav ml-auto">
			<li className="nav-item">
				<Link className="nav-link" to="/dashboard">
					Dashboard
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/registerOffice">
					Register Office
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/registerDoctor">
					Register Doctor
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/updateDoctor">
					Update Doctor
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/viewNewUsers">
					View New Users
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/viewUpdatedUsers">
					View Updated Users
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/cancelAppointment">
					Cancel Appointment
				</Link>
			</li>
			<li className="nav-item">
				<i className="nav-link" onClick={logoutUser}>
					Logout
				</i>
			</li>
		</ul>
	);

	const guestLinks = (
		<ul className="navbar-nav ml-auto">
			<li className="nav-item">
				<Link className="nav-link" to="/aboutus">
					About Us
				</Link>
			</li>

			<li className="nav-item dropdown">
				<a
					className="nav-link dropdown-toggle"
					href="/#"
					id="navbarDropdownMenuLink-4"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
				>
					<i className="fas fa-user"></i> Profile{' '}
				</a>

				<div
					className="dropdown-menu dropdown-menu-right dropdown-info"
					aria-labelledby="navbarDropdownMenuLink-4"
				>
					<Link className="dropdown-item" to="/login">
						Login
					</Link>
					<Link className="dropdown-item" to="/login/doctor">
						Employee Login
					</Link>
					<Link className="dropdown-item" to="/register">
						Register
					</Link>
				</div>
			</li>
		</ul>
	);

	const navLinks = () => {
		if (isAuthenticated) {
			if (user) {
				if (user.role === 'patient') {
					return authLinks;
				} else if (user.role === 'doctor') {
					return doctorLinks;
				} else if (user.role === 'admin') {
					return adminLinks;
				}
			}
		}
		return guestLinks;
	};
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Link to="/">
				<img src={logo} alt="logo" />
			</Link>
			{/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button> */}

			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				{!loading && navLinks()}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavbarComponent;
