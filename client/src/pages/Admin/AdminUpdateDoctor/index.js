import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
// import { Link } from 'react-router-dom';
// import Loading from '../../Loading';
import './AdminUpdateDoctor.css';

const RegisterComponent = () => {
	const register = useStoreActions(
		(actions) => actions.auth.adminUpdateDoctor
	);
	const admin = useStoreState((state) => state.auth.user);
	const token = useStoreState((state) => state.auth.token);
	const loading = useStoreState(state => state.auth.loading);
	const adminToken = useStoreState((state) => state.auth.token);

	//offices
	const getOffices = useStoreActions((actions) => actions.admin.getOffices);
	const officeLoading = useStoreState((state) => state.admin.officeLoading);
	const offices = useStoreState((state) => state.admin.offices);

	//doctors
	const getDoctors = useStoreActions((actions) => actions.admin.getDoctors);
	const doctorLoading = useStoreState((state) => state.admin.doctorLoading);
	const doctors = useStoreState((state) => state.admin.doctors);

	useEffect(() => {
		getOffices(adminToken);
		getDoctors(adminToken);
	}, []);

	const [formData, setFormData] = useState({
		doctorID: '',
		primary: '',
		specialty: '',
		office: '',
	});

	const { doctorID, primary, specialty, office } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const userRegister = {
			doctorID,
			primary,
			specialty,
			office,
		};
		register(userRegister);
	};

	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row no-gutter">
					<div className="d-none d-md-flex col-md-4 col-lg-6 bg-admin-dashboard"></div>
					<div className="col-md-8 col-lg-6">
						<div className="login d-flex align-items-center py-5">
							<div className="container">
								<div className="row">
									<div className="col-md-9 col-lg-4 mx-auto">
										<h3 className="login-heading mb-4">
											Update Doctor
										</h3>
										<form
											className="form"
											onSubmit={(e) => onSubmit(e)}
										>
											<div className="form-group">
												<select
													name="doctorID"
													value={doctorID}
													key={doctorID}
													onChange={(e) => onChange(e)}
												>
													<option value="Doctor">Doctor</option>
													{doctors.map((doctor, idx) => {
														return (
															<option value={doctor.doctor_id}>
																{`Dr. ${doctor.doctor_first_name} ${doctor.doctor_last_name} - ${doctor.doctor_specialty}`}
															</option>
														);
													})}
												</select>
											</div>
											<div className="form-group">
												<select
													name="office"
													value={office}
													key={office}
													onChange={(e) => onChange(e)}
												>
													<option value="Office">Office</option>
													{offices.map((office, idx) => {
														return (
															<option value={office.office_id}>
																{`${office.address_name} ${
																	office.address2_name
																		? office.address2_name
																		: ''
																}, ${office.city} ${
																	office.state
																} ${office.zip}`}
															</option>
														);
													})}
												</select>
											</div>
											<div className="form-group">
												<select
													name="primary"
													value={primary}
													key={primary}
													onChange={(e) => onChange(e)}
												>
													<option value="primary">
														Primary Doctor
													</option>
													<option value="Yes">Yes</option>
													<option value="No">No</option>
												</select>
											</div>
											<div className="form-group">
												<select
													name="specialty"
													value={specialty}
													key={specialty}
													onChange={(e) => onChange(e)}
												>
													<option value="specialty">
														Choose a Specialty
													</option>
													<option value="Primary">Primary</option>
													<option value="Cardiac">Cardiac</option>
													<option value="Pulmonary">
														Pulmonary
													</option>
													<option value="Neurology">
														Neurology
													</option>
												</select>
											</div>

											<input
												type="submit"
												className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
												value="Update"
											/>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default RegisterComponent;
