/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import './UpdateDiagnosis.css';

const UpdateDiagnosis = () => {
	const updateDiagnosis = useStoreActions(
		(actions) => actions.doctor.updateDiagnosis
	);
	//patients
	const getPatients = useStoreActions((actions) => actions.doctor.getPatients);
	const patients = useStoreState((state) => state.doctor.patients);
	//diagnoses
	const getDiagnoses = useStoreActions(
		(actions) => actions.doctor.getDiagnoses
	);
	const diagnoses = useStoreState((state) => state.doctor.diagnoses);

	useEffect(() => {
		getPatients();
		getDiagnoses();
	}, []);

	const [formData, setFormData] = useState({
		patientID: '',
		diagnosisID: '',
		specialty: '',
	});

	const { patientID, diagnosisID, specialty } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		updateDiagnosis({ patientID, diagnosisID, specialty });
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
										<h3 className="login-heading mb-4">
											Update Diagnosis
										</h3>
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
													name="diagnosisID"
													value={diagnosisID}
													key={diagnosisID}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												>
													<option value="Diagnosis">
														Diagnosis
													</option>
													{diagnoses.map((diagnosis, idx) => {
														return (
															<option
																value={diagnosis.diagnosis_id}
															>
																{`${diagnosis.diagnosis_symptoms} - ${diagnosis.diagnosis_condition}`}
															</option>
														);
													})}
												</select>
											</div>

											<div className="form-group">
												<select
													name="specialty"
													value={specialty}
													key={specialty}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												>
													<option value="State">
														Refer to Specialist
													</option>
													<option value="None">None</option>
													<option value="Cardiac">Cardiac</option>
													<option value="Pulmonary">
														Pulmonary
													</option>
													<option value="Physical">
														Physical
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

export default UpdateDiagnosis;
