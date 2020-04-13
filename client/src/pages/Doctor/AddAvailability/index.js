import { useStoreState } from 'easy-peasy';
import React from 'react';
import './AddAvailability.css';

const DoctorDashboardComponent = () => {
	const admin = useStoreState((state) => state.auth.user);
	
	return (
		<div className="container-fluid">
			<div className="row no-gutter">
				<div className="d-none d-md-flex col-md-4 col-lg-6 bg-doctor-dashboard"></div>
				<div className="col-md-8 col-lg-6">
					<div className="login d-flex align-items-center py-5">
						<div className="container">
							<div className="row">
								<div className="col-md-9 col-lg-8 mx-auto">
									<div className="welcome text-center">
										<h1>Add Availability</h1>										
									</div>
									<div className="body text-center"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DoctorDashboardComponent;