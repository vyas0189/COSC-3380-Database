import { useStoreState } from 'easy-peasy';
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
const Home = () => {

    const isAuth = useStoreState(state => state.auth.isAuthenticated);

	return (
		<header className="masthead">
			<div className="container d-flex align-items-center">
				<div className="mx-auto text-center mainText">
					<h1 className="mx-auto my-0 text-uppercase">Welcome to APlus Care!</h1>
					<h2 className="text-black-90 mx-auto mt-2 mb-5">We are a healthcare provider looking to connect patients with the
 				care that they need. Please refer to our navigation bar to register or schedule an appointment.</h2>
					{
						<Link to={
							isAuth ? '/schedule' : '/login'
						} className="btn btn-primary-home js-scroll-trigger btn-home text-uppercase">Schedule Now</Link>
					}
				</div>
			</div>
		</header>
    );
}

export default Home;