import { useStoreActions } from 'easy-peasy';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import setAuthToken from '../utils/setAuthToken';
import Navbar from './Navbar';
import PrivateRoute from './ProtectedRoute';
function App() {

  const user = useStoreActions(actions => actions.auth.getCurrentPatient)

  useEffect(() => {
    setAuthToken(localStorage.token)
    user();
  }, [])

  return (
    <section>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
      </Switch>
    </section>
  );
}

export default App;
