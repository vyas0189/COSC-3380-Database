import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import moment from 'moment';
import { Button, Form, ListGroup, Modal, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import Loading from '../../Loading';
import './AddAvailability.css';

const AddComponent = () => {
	const register = useStoreActions((actions) => actions.doctor.addAvailability);

	const doctor = useStoreState((state) => state.auth.user);
	const getOffices = useStoreActions((actions) => actions.doctor.getOffices);
	const offices = useStoreState((state) => state.doctor.offices);

	const loading = useStoreState((state) => state.auth.loading);

	useEffect(() => {
		getOffices();
	}, []);

	const [formData, setFormData] = useState({
		office: '',
		availabilityDate: '',
	});

	const { office, availabilityDate } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const availabilityInfo = {
			office,
			availabilityDate,
		};
		register(availabilityInfo);
		setFormData({
			office: '',
			availabilityDate: '',
		})
	};

	return (
		loading ? <Loading />:
			<Fragment>
				<div className="container-fluid">
					<div className="row no-gutter">
						<div className="d-none d-md-flex col-md-4 col-lg-6 bg-doctor-dashboard"></div>
						<div className="col-md-8 col-lg-6">
							<div className="login d-flex align-items-center py-5">
								<div className="container">
									<div className="row">
										<div className="col-md-9 col-lg-4 mx-auto">
											<h3 className="login-heading mb-4">Add Availability</h3>
											<form
												className="form"
												onSubmit={(e) => onSubmit(e)}
											>
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
													<input
														type="date"
														placeholder="Date MM-DD-YYYY"
														name="availabilityDate"
														value={availabilityDate}
														onChange={(e) => onChange(e)}
														required
													/>
												</div>

												<input
													type="submit"
													className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
													value="Add"
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

export default AddComponent;
