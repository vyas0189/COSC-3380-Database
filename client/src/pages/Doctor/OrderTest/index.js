/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import './OrderTest.css';

const OrderTest = () => {
	const orderTest = useStoreActions((actions) => actions.doctor.orderTest);
	const getPatients = useStoreActions((actions) => actions.doctor.getPatients);
	const patients = useStoreState((state) => state.doctor.patients);

	useEffect(() => {
		getPatients();
	}, []);

	const [formData, setFormData] = useState({
		patientID: '',
		scan: '',
		physical: '',
		blood: '',
	});

	const { patientID, scan, physical, blood } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		orderTest({ patientID, scan, physical, blood });
	};

	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row no-gutter">
					<div className="d-none d-md-flex col-md-4 col-lg-6 bg-doctor-dashboard"></div>
					<div className="col-md-8 col-lg-6">
						<div className="login d-flex align-items-center py-5">
							<div className="container">
								<div className="row">
									<div className="col-md-9 col-lg-4 mx-auto">
										<h3 className="login-heading mb-4">Order Test</h3>
										<form
											className="form"
											onSubmit={(e) => onSubmit(e)}
										>
											<div className="form-group">
												<select
													name="patientID"
													value={patientID}
													key={patientID}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												>
													<option value="Patient">Patient</option>
													{patients.map((patient, idx) => {
														return (
															<option value={patient.patient_id}>
																{`${
																	patient.patient_first_name
																	} ${
																	patient.patient_last_name
																	} - ${moment(
																		patient.patient_dob
																	).format('MM/DD/YYYY')}
																	`}
															</option>
														);
													})}
												</select>
											</div>
											<div className="form-group">
												<select
													name="scan"
													value={scan}
													key={scan}
													className="form-control"
													onChange={(e) => onChange(e)}
													autoFocus
												>
													<option value="Scan">Scan?</option>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</select>
											</div>
											<div className="form-group">
												<select
													name="physical"
													value={physical}
													key={physical}
													className="form-control"
													onChange={(e) => onChange(e)}
													autoFocus
												>
													<option value="Physical">
														Physical Exam?
													</option>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</select>
											</div>
											<div className="form-group">
												<select
													name="blood"
													value={blood}
													key={blood}
													className="form-control"
													onChange={(e) => onChange(e)}
													autoFocus
												>
													<option value="Blood">
														Blood Test?
													</option>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</select>
											</div>

											<input
												type="submit"
												className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
												value="Order"
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

export default OrderTest;
