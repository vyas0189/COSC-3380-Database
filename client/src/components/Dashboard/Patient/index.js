import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Container, ListGroup, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import './Patient.css';

const PatientDashboardComponent = () => {
    const patient = useStoreState(state => state.auth.user);
    const getAppointment = useStoreActions(actions => actions.patient.getAppointments)
    const appointmentLoading = useStoreState(state => state.patient.appointmentLoading);
    const appointmentDetailsLoading = useStoreState(state => state.patient.appointmentDetailsLoading);
    const appointments = useStoreState(state => state.patient.appointments);
    const cancelAppointment = useStoreActions(actions => actions.patient.cancelAppointment);
    const getAppointmentDetails = useStoreActions(actions => actions.patient.getAppointmentDetails);
    const appointmentDetails = useStoreState(state => state.patient.appointmentDetails)
    const [show, setShow] = useState(false);
    const isAuth = useStoreState(state => state.auth.isAuthenticated);

    const handleClose = () => setShow(false);
    const handleShow = (appointmentID) => {
        setShow(true);
        getAppointmentDetails({ appointmentID })
    };

    useEffect(() => {
        getAppointment();
    }, []);

    const UpcomingAppointment = () => {

        return (<Table striped bordered hover >
            <thead>
                <tr>

                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
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
                                <td>{appointment.doctor_specialty}</td>
                                <td>{`${appointment.address_name} ${appointment.address2_name ? appointment.address2_name : ''}, ${appointment.city} ${appointment.state} ${appointment.zip}`}</td>
                                <td>
                                    <Button className="btn btn-danger" onClick={(e) => {
                                        e.preventDefault()
                                        cancelAppointment({ appointmentID: appointment.appointment_id })
                                    }}>Cancel</Button>
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
                    <th>Specialty</th>
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
                                <th>{appointment.doctor_specialty}</th>
                                <td>{`${appointment.address_name} ${appointment.address2_name ? appointment.address2_name : ''}, ${appointment.city} ${appointment.state} ${appointment.zip}`}</td>
                                <td>
                                    <p className="cancelApp badge badge-info" onClick={() => handleShow(appointment.appointment_id)}>View</p>
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
                        appointments.length <= 0 ? <div className="text-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 ">
                                        <div className="text-text">
                                            <h1 className="text">_</h1>
                                            <div className="im-sheep">
                                                <div className="top">
                                                    <div className="body"></div>
                                                    <div className="head">
                                                        <div className="im-eye one"></div>
                                                        <div className="im-eye two"></div>
                                                        <div className="im-ear one"></div>
                                                        <div className="im-ear two"></div>
                                                    </div>
                                                </div>
                                                <div className="im-legs">
                                                    <div className="im-leg"></div>
                                                    <div className="im-leg"></div>
                                                    <div className="im-leg"></div>
                                                    <div className="im-leg"></div>
                                                </div>
                                            </div>
                                            <h1>No scheduled appointment</h1>
                                            {<Link to={
                                                isAuth ? '/patient/schedule' : '/login'
                                            } className="btn btn-primary btn-round">Schedule Now</Link>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
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
                                    <ListGroup.Item>Specialty: {appointmentDetails.doctor_specialty ? appointmentDetails.doctor_specialty : 'N/A'}</ListGroup.Item>

                                    <ListGroup.Item>Scan: {appointmentDetails.test_scan ? 'Yes' : 'No'}</ListGroup.Item>
                                    <ListGroup.Item>Physical: {appointmentDetails.test_physical ? 'Yes' : 'No'}</ListGroup.Item>
                                    <ListGroup.Item>Blood Test: {appointmentDetails.test_blood ? 'Yes' : 'No'}</ListGroup.Item>
                                    <ListGroup.Item>Symptoms: {appointmentDetails.diagnosis_symptoms ? appointmentDetails.diagnosis_symptoms : 'N/A'}</ListGroup.Item>
                                    <ListGroup.Item>Condition: {appointmentDetails.diagnosis_condition ? appointmentDetails.diagnosis_condition : 'N/A'}</ListGroup.Item>

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


        </Container >
    )
}

export default PatientDashboardComponent