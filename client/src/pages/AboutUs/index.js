import { useStoreState } from 'easy-peasy';
import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
	const isAuth = useStoreState((state) => state.auth.isAuthenticated);

	return (
		<div className="container-fluid">
			<div className="row no-gutter">
				<div className="d-none d-md-flex col-md-4 col-lg-6 bg-aboutUs"></div>
				<div className="col-md-8 col-lg-6">
					<div className="login d-flex align-items-center py-5">
						<div className="container">
							<div className="row">
								<div className="col-md-9 col-lg-8 mx-auto">
									<div className="welcome text-center">
										<h1>MW Team 9 Medical Clinic Database Project</h1>
										<h2>Vyas Ramnakulangara - vyas0189</h2>
										<h2>Michael Patrick Austin - mpaustin1993</h2>
										<h2>Justin West - Justin-WR-West</h2>
										<h2>Tony Nguyen - aqnguy30</h2>
										<h2>Alexander Tran - altub</h2>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutUs;
