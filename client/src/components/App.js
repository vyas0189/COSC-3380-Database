import { useStoreActions } from 'easy-peasy';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AboutUs from '../pages/AboutUs';
//admin imports
import AdminCancelAppointment from '../pages/Admin/AdminCancelAppointment';
import AdminUpdateDoctor from '../pages/Admin/AdminUpdateDoctor';
import RegisterDoctor from '../pages/Admin/RegisterDoctor';
import RegisterOffice from '../pages/Admin/RegisterOffice';
import ViewNewUsers from '../pages/Admin/ViewNewUsers';
import ViewUpdatedUsers from '../pages/Admin/ViewUpdatedUsers';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFound';
import Register from '../pages/Register';
import setAuthToken from '../utils/setAuthToken';
import NavbarComponent from './Navbar';
import PrivateRoute from './ProtectedRoute';
import AdminRoute from './ProtectedRoute/AdminRoute';

toast.configure();
const App = () => {
  const user = useStoreActions((actions) => actions.auth.getCurrentPatient);

  useEffect(() => {
    setAuthToken(localStorage.token);
    user();
  }, [user]);

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
          path="/updateDoctor"
          component={AdminUpdateDoctor}
        />
        <AdminRoute
          exact
          path="/viewNewUsers"
          component={ViewNewUsers}
        />
        <AdminRoute
          exact
          path="/viewUpdatedUsers"
          component={ViewUpdatedUsers}
        />

        <Route component={NotFoundPage} />

      </Switch>
    </>
  );
};

export default App;
