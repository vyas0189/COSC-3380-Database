import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, ListGroup, Modal, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Loading from '../../../components/Loading';
import './ViewAppointments.css';
import moment from 'moment';

const ViewAppointments = () => {
	const formatPhoneNumber = (phoneNumberString) => {
		const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
		const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			const intlCode = match[1] ? '+1 ' : '';
			return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
				''
			);
		}
		return null;
	};

	const getAppointments = useStoreActions(
		(actions) => actions.admin.getAppointments
	);
	const doctors = useStoreState((state) => state.admin.doctors);
	const doctorAppts = useStoreState((state) => state.admin.doctorAppts);
	const specialtyAppts = useStoreState((state) => state.admin.specialtyAppts);
	const apptCount = useStoreState((state) => state.admin.apptCount);

	const [show, setShow] = useState(false);

	useEffect(() => {
		getAppointments({
			startDate: '1999-01-01',
			endDate: moment().format('YYYY-MM-DD'),
		});
	}, []);

	const [formData, setFormData] = useState({
		startDate: '',
		endDate: '',
	});

	const history = useHistory();

	const handleClose = (e) => {
		// e.preventDefault();
		setShow(false);
		history.push('/viewAppointments');
	};

	const handleShow = () => {
		setShow(true);
	};

	const { startDate, endDate } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleShow();
		getAppointments({
			startDate: moment(startDate).format('YYYY-MM-DD'),
			endDate: moment(endDate).format('YYYY-MM-DD'),
		});
	};

	return (
		<div className="container-fluid">
			<div className="row no-gutter">
				<div className="d-none d-md-flex col-md-4 col-lg-6 bg-admin-dashboard"></div>
				<div className="col-md-8 col-lg-6">
					<div className="login d-flex align-items-center py-5">
						<div className="container">
							<div className="row">
								<div className="col-md-9 col-lg-4 mx-auto">
									<h3 className="login-heading mb-4">
										View Appointment Information
									</h3>
									<form onSubmit={(e) => handleSubmit(e)}>
										<div className="form-group">
											<input
												type="date"
												placeholder="startDate Date"
												name="startDate"
												value={startDate}
												className="form-control"
												autoFocus
												onChange={(e) => onChange(e)}
												required
											/>
										</div>

										<div className="form-group">
											<input
												type="date"
												placeholder="endDate Date"
												name="endDate"
												value={endDate}
												className="form-control"
												autoFocus
												onChange={(e) => onChange(e)}
												required
											/>
										</div>

										<button
											id="modalActivate"
											type="submit"
											className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
											data-toggle="modal"
											data-target="#appointmentModal"
										>
											View
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="modal fade right"
				id="appointmentModal"
				tabindex="1"
				role="dialog"
				// aria-labelledby="exampleModalPreviewLabel"
				// aria-hidden="true"
			>
				<div
					class="modal-dialog-full-width modal-dialog momodel modal-fluid"
					role="document"
				>
					<div class="modal-content-full-width modal-content ">
						<div class="modal-header">
							<div class="modal-title">
								Appointment & Doctor Information
							</div>
						</div>

						<div class="modal-body">
							<ListGroup horizontal>
								<b>Total Appointments:</b>
								{apptCount.map((count, idx) => (
									<div class="list-group-item-custom">
										{count.count}
									</div>
								))}
							</ListGroup>
							<ListGroup horizontal>
								<b>Appointments by Doctor:</b>
								{doctorAppts.map((doctorAppt, idx) => (
									<div class="list-group-item-custom">
										Dr. {doctorAppt.doctor_first_name}{' '}
										{doctorAppt.doctor_last_name}: {doctorAppt.count}
									</div>
								))}
							</ListGroup>
							{/* <ListGroup horizontal>
								<b>Average Appointments per Doctor:</b>
								{doctorAppts.map((doctorAppt, idx) => {
									if (idx === 0)
										return (
											<div class="list-group-item-custom">
												{doctorAppt.average}
											</div>
										);
								})}
							</ListGroup> */}
							<ListGroup horizontal>
								<b>Appointments by Specialty:</b>
								{specialtyAppts.map((specialtyAppt, idx) => (
									<div class="list-group-item-custom">
										{specialtyAppt.doctor_specialty}:{' '}
										{specialtyAppt.count}
									</div>
								))}
							</ListGroup>
							{/* <ListGroup horizontal>
								<b>Average Appointments per Specialty:</b>
								{specialtyAppts.map((specialtyAppt, idx) => {
									if (idx === 0)
										return (
											<div class="list-group-item-custom">
												{specialtyAppt.average}
											</div>
										);
								})}
							</ListGroup> */}
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Username</th>
										<th>Role</th>
										<th>Date Registered</th>
										<th>Id</th>
										<th>Name</th>
										<th>Email</th>
										<th>Phone Number</th>
										<th>Specialty</th>
									</tr>
								</thead>
								<tbody>
									{doctors.map((doctor, idx) => {
										return (
											<tr key={idx}>
												<td>{`${doctor.username}`}</td>
												<td>{`${doctor.role}`}</td>
												<td>
													{moment(doctor.created_at).format(
														'MM/DD/YYYY'
													)}
												</td>
												<td>{`${doctor.doctor_id}`}</td>
												<td>{`${doctor.doctor_first_name} ${doctor.doctor_last_name}`}</td>
												<td>{`${doctor.doctor_email}`}</td>
												<td>
													{formatPhoneNumber(
														doctor.doctor_phone_number
													)}
												</td>
												<td>{`${doctor.doctor_specialty}`}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewAppointments;
