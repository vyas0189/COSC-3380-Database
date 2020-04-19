import { useStoreActions } from 'easy-peasy';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DoctorSchedule from '../components/Schedule/Doctor';
import PatientSchedule from '../components/Schedule/Patient';
import AboutUs from '../pages/AboutUs';
//admin imports
import AdminCancelAppointment from '../pages/Admin/AdminCancelAppointment';
import AdminUpdateDoctor from '../pages/Admin/AdminUpdateDoctor';
import RegisterDoctor from '../pages/Admin/RegisterDoctor';
import RegisterOffice from '../pages/Admin/RegisterOffice';
import ViewPatients from '../pages/Admin/ViewPatients';
import ViewAppointments from '../pages/Admin/ViewAppointments';
import Dashboard from '../pages/Dashboard';
//doctor imports
import AddAvailability from '../pages/Doctor/AddAvailability';
import OrderTest from '../pages/Doctor/OrderTest';
import UpdateAvailability from '../pages/Doctor/UpdateAvailability';
import UpdateDiagnosis from '../pages/Doctor/UpdateDiagnosis';
import UpdateDoctor from '../pages/Doctor/UpdateDoctor';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFound';
import Register from '../pages/Register';
import setAuthToken from '../utils/setAuthToken';
import PatientProfile from './Dashboard/Patient/Profile';
import NavbarComponent from './Navbar';
import PrivateRoute from './ProtectedRoute';
import AdminRoute from './ProtectedRoute/AdminRoute';
import PatientScheduleComponent from './Schedule/Patient';

toast.configure();
const App = () => {
	const user = useStoreActions((actions) => actions.auth.getCurrentPatient);

	useEffect(() => {
		setAuthToken(localStorage.token);
		user();
	}, []);

	return (
		<>
			<NavbarComponent />
			<Switch>
				{/* general pages */}

				<Route exact path="/" component={Home} />
				<Route exact path="/aboutus" component={AboutUs} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/register" component={Register} />
				<Route exact path="/login/doctor" component={Login} />
				<Route exact path="/login/admin" component={Login} />

				<PrivateRoute exact path="/dashboard" component={Dashboard} />
				<PrivateRoute
					exact
					path="/patient/schedule"
					component={PatientScheduleComponent}
				/>
				<PrivateRoute
					exact
					path="/patient/profile"
					component={PatientProfile}
				/>
				{/* admin pages */}

				<AdminRoute
					exact
					path="/cancelAppointment"
					component={AdminCancelAppointment}
				/>
				<AdminRoute
					exact
					path="/registerDoctor"
					component={RegisterDoctor}
				/>
				<AdminRoute
					exact
					path="/registerOffice"
					component={RegisterOffice}
				/>
				<AdminRoute
					exact
					path="/adminUpdateDoctor"
					component={AdminUpdateDoctor}
				/>
				<AdminRoute exact path="/viewPatients" component={ViewPatients} />
				<AdminRoute
					exact
					path="/viewAppointments"
					component={ViewAppointments}
				/>

				{/* doctor pages */}

				<PrivateRoute
					exact
					path="/addAvailability"
					component={AddAvailability}
				/>
				<PrivateRoute exact path="/orderTest" component={OrderTest} />
				<PrivateRoute
					exact
					path="/updateAvailability"
					component={UpdateAvailability}
				/>
				<PrivateRoute
					exact
					path="/updateDiagnosis"
					component={UpdateDiagnosis}
				/>
				<PrivateRoute exact path="/updateDoctor" component={UpdateDoctor} />

				<Route component={NotFoundPage} />
			</Switch>
		</>
	);
};

export default App;
