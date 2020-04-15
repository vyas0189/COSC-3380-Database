import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Container, ListGroup, Modal, Table } from 'react-bootstrap';
import Loading from '../../Loading';
import './Patient.css';

const PatientDashboardComponent = () => {
    const patient = useStoreState(state => state.auth.user);
    const getAppointment = useStoreActions(actions => actions.patient.getAppointments)
    const patientToken = useStoreState(state => state.auth.token);
    const appointmentLoading = useStoreState(state => state.patient.appointmentLoading);
    const appointmentDetailsLoading = useStoreState(state => state.patient.appointmentDetailsLoading);
    const appointments = useStoreState(state => state.patient.appointments);
    const token = useStoreState(state => state.auth.token);
    const cancelAppointment = useStoreActions(actions => actions.patient.cancelAppointment);
    const getAppointmentDetails = useStoreActions(actions => actions.patient.getAppointmentDetails);
    const appointmentDetails = useStoreState(state => state.patient.appointmentDetails)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (token, doctorID) => {
        setShow(true);
        getAppointmentDetails({ token, doctorID })
    };

    useEffect(() => {

        getAppointment(patientToken)

    }, [getAppointment, patientToken]);

    const UpcomingAppointment = () => {

        return (<Table striped bordered hover >
            <thead>
                <tr>

                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Office</th>
                    <th>Cancel</th>
                </tr>
            </thead>
            <tbody>
                {
                    appointments.map((appointment, idx) => {
                        return (moment(appointment.availability_date).isAfter(new Date()) ? (
                            <tr key={idx}>

                                <td>{moment(appointment.availability_date).format('MM/DD/YYYY')}</td>
                                <td>{moment(appointment.availability_from_time, 'hh:mm:ss').format('hh:mm A')}</td>
                                <td>{`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</td>
                                <td>{`${appointment.address_name} ${appointment.address2_name ? appointment.address2_name : ''}, ${appointment.city} ${appointment.state} ${appointment.zip}`}</td>
                                <td>
                                    <p className="cancelApp badge badge-danger" onClick={(e) => {
                                        e.preventDefault()
                                        cancelAppointment({ token, appointmentID: appointment.appointment_id })
                                    }}>Cancel</p>
                                </td>
                            </tr>
                        ) : null
                        )
                    })

                }
            </tbody>
        </Table >
        )
    }

    const pastAppointment = () => {
        return (<Table striped bordered hover >
            <thead>
                <tr>

                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Office</th>
                    <th>Appointment Details</th>
                </tr>
            </thead>
            <tbody>
                {
                    appointments.map((appointment, idx) => {
                        return (moment(appointment.availability_date).isBefore(new Date()) ? (
                            <tr key={idx}>

                                <td>{moment(appointment.availability_date).format('MM/DD/YYYY')}</td>
                                <td>{moment(appointment.availability_from_time, 'hh:mm:ss').format('hh:mm A')}</td>
                                <td>{`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</td>
                                <td>{`${appointment.address_name} ${appointment.address2_name ? appointment.address2_name : ''}, ${appointment.city} ${appointment.state} ${appointment.zip}`}</td>
                                <td>
                                    <p className="cancelApp badge badge-info" onClick={() => handleShow(token, appointment.doctor_id)}>View</p>
                                </td>
                            </tr>
                        ) : null
                        )
                    })

                }
            </tbody>
        </Table >
        )
    }
    return (
        <Container>
            <h1 className="mt-5">Welcome {patient.patient_first_name} {patient.patient_last_name}</h1>
            {
                appointmentLoading ? <Loading /> :
                    (
                        appointments.length <= 0 ? <h3>No Appointments</h3> :
                            (
                                <>
                                    <h2 className="mt-5 mb-4">Upcoming Appointment</h2>
                                    {UpcomingAppointment()}
                                    <h2 className="mt-5 mb-4">Appointment History</h2>
                                    {pastAppointment()}
                                </>
                            )
                    )
            }

            {appointmentDetailsLoading ? <Loading /> : (
                <Modal show={show} onHide={handleClose}>
                    {appointmentDetails.length <= 0 ? (
                        <>
                            <Modal.Body>Appointment Details</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                    </Button>
                            </Modal.Footer>
                        </>
                    ) : (
                            <>
                                < Modal.Header closeButton>
                                    <Modal.Title>Appointment Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Specialty: {appointmentDetails[0].doctor_specialty ? appointmentDetails[0].doctor_specialty : 'N/A'}</ListGroup.Item>

                                        <ListGroup.Item>Scan: {appointmentDetails[0].test_scan ? 'Yes' : 'No'}</ListGroup.Item>
                                        <ListGroup.Item>Physical: {appointmentDetails[0].test_physical ? 'Yes' : 'No'}</ListGroup.Item>
                                        <ListGroup.Item>Blood Test: {appointmentDetails[0].test_blood ? 'Yes' : 'No'}</ListGroup.Item>
                                        <ListGroup.Item>Symptoms: {appointmentDetails[0].diagnosis_symptoms ? appointmentDetails[0].diagnosis_symptoms : 'N/A'}</ListGroup.Item>
                                        <ListGroup.Item>Condition: {appointmentDetails[0].diagnosis_condition ? appointmentDetails[0].diagnosis_condition : 'N/A'}</ListGroup.Item>

                                    </ListGroup>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}


                </Modal>
            )
            }

        </Container >
    )
}

export default PatientDashboardComponent