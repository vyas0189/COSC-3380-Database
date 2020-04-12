import { useStoreState } from 'easy-peasy';
import React from 'react';
import { Link } from 'react-router-dom';
import './Patient.css';

const PatientDashboardComponent = () => {
	const patient = useStoreState((state) => state.auth.user);
	console.log(patient);

	return (
		<div className="container-fluid">
			<div className="row no-gutter">
				<div className="d-none d-md-flex col-md-4 col-lg-6 bg-patient-dashboard"></div>
				<div className="col-md-8 col-lg-6">
					<div className="login d-flex align-items-center py-5">
						<div className="container">
							<div className="row">
								<div className="col-md-9 col-lg-8 mx-auto">
									<div className="welcome text-center">
										<h1>
											Welcome, {patient.patient_first_name}{' '}
											{patient.patient_last_name}.
										</h1>
										<h2>How can we help you today?</h2>
									</div>
									<div className="body text-center">
										<h3>Appointment History</h3>
										<h3>Upcoming Appointment</h3>
										{patient.patient_primary_doctor ? (
											<button className="btn btn-lg btn-primary btn-login text-uppercase font-weight-bold mb-2">
												{' '}
												Schedule An Appointment with a Primary
												Doctor
											</button>
										) : (
											<button className="btn btn-lg btn-primary btn-login text-uppercase font-weight-bold mb-2">
												{' '}
												Schedule An Appointment with a Primary
												Doctor
											</button>
										)}
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

export default PatientDashboardComponent;
