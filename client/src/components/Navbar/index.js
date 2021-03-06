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
				<Link className="nav-link" to="/patient/schedule">
					Schedule
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to='/patient/profile'>Profile</Link>
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
			<li className="nav-item">
				<Link className="nav-link" to="/addAvailability">
					Add Availability
				</Link>
			</li>

			<li className="nav-item">
				<Link className="nav-link" to="/updateAvailability">
					Update Availability
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/updateDoctor">
					Update Profile
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/updateDiagnosis">
					Update Diagnosis
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/orderTest">
					Order Test
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
				<Link className="nav-link" to="/adminUpdateDoctor">
					Update Doctor
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/viewPatients">
					View Patients
				</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/viewAppointments">
					View Appointments
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

			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				{!loading && navLinks()}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavbarComponent;
