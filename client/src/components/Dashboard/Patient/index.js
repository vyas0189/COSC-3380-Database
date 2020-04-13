import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import './Patient.css';

const PatientDashboardComponent = () => {
	const patient = useStoreState((state) => state.auth.user);
	const getAppointment = useStoreActions(
		(actions) => actions.patient.getAppointments
	);
	const patientToken = useStoreState((state) => state.auth.token);
	const appointmentLoading = useStoreState(
		(state) => state.patient.appointmentLoading
	);
	const appointments = useStoreState((state) => state.patient.appointments);
	const token = useStoreState((state) => state.auth.token);
	const cancelAppointment = useStoreActions(
		(actions) => actions.patient.cancelAppointment
	);

	useEffect(() => {
		getAppointment(patientToken);
	}, []);

	const UpcomingAppointment = () => {
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Date</th>
						<th>Time</th>
						<th>Doctor</th>
						<th>Office</th>
						<th>Cancel</th>
					</tr>
				</thead>
				<tbody>
					{appointments.map((appointment, idx) => {
						return moment(appointment.availability_date).isAfter(
							new Date()
						) ? (
							<tr key={idx}>
								<td>{idx + 1}</td>
								<td>
									{moment(appointment.availability_date).format(
										'MM/DD/YYYY'
									)}
								</td>
								<td>
									{moment(
										appointment.availability_from_time,
										'hh:mm:ss'
									).format('hh:mm A')}
								</td>
								<td>{`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</td>
								<td>{`${appointment.address_name} ${
									appointment.address2_name
										? appointment.address2_name
										: ''
								}, ${appointment.city} ${appointment.state} ${
									appointment.zip
								}`}</td>
								<td>
									<p
										onClick={(e) => {
											e.preventDefault();
											cancelAppointment({
												token,
												appointmentID: appointment.appointment_id,
											});
										}}
									>
										Cancel
									</p>
								</td>
							</tr>
						) : null;
					})}
				</tbody>
			</Table>
		);
	};

	const pastAppointment = () => {
		return (
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Date</th>
						<th>Time</th>
						<th>Doctor</th>
						<th>Office</th>
					</tr>
				</thead>
				<tbody>
					{appointments.map((appointment, idx) => {
						return moment(appointment.availability_date).isBefore(
							new Date()
						) ? (
							<tr key={idx}>
								<td>{idx + 1}</td>
								<td>
									{moment(appointment.availability_date).format(
										'MM/DD/YYYY'
									)}
								</td>
								<td>
									{moment(
										appointment.availability_from_time,
										'hh:mm:ss'
									).format('hh:mm A')}
								</td>
								<td>{`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</td>
								<td>{`${appointment.address_name} ${
									appointment.address2_name
										? appointment.address2_name
										: ''
								}, ${appointment.city} ${appointment.state} ${
									appointment.zip
								}`}</td>
							</tr>
						) : null;
					})}
				</tbody>
			</Table>
		);
	};
	return (
		<div>
			<h1>
				Welcome {patient.patient_first_name} {patient.patient_last_name}
			</h1>
			{appointmentLoading ? (
				<Loading />
			) : appointments.length <= 0 ? (
				<h3>No Appointments</h3>
			) : (
				<>
					<h2>Upcoming Appointment</h2>
					{UpcomingAppointment()}
					<h2>Appointment History</h2>
					{pastAppointment()}
				</>
			)}

			<Link to="/schedule">Schedule An Appointment</Link>
		</div>
	);
};

export default PatientDashboardComponent;
