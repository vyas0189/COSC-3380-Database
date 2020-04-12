import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';

const PatientDashboardComponent = () => {
    const patient = useStoreState(state => state.auth.user);
    const getAppointment = useStoreActions(actions => actions.patient.getAppointments)
    const patientToken = useStoreState(state => state.auth.token);
    const appointmentLoading = useStoreState(state => state.patient.appointmentLoading);
    const appointments = useStoreState(state => state.patient.appointments);
    const token = useStoreState(state => state.auth.token);
    const cancelAppointment = useStoreActions(actions => actions.patient.cancelAppointment)

    useEffect(() => {

        getAppointment(patientToken)

    }, []);

    const UpcomingAppointment = () => {

        return (<Table striped bordered hover >
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
                {
                    appointments.map((appointment, idx) => {
                        return (moment(appointment.availability_date).isAfter(new Date) ? (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{moment(appointment.availability_date).format('MM/DD/YYYY')}</td>
                                <td>{moment(appointment.availability_from_time, 'hh:mm:ss').format('hh:mm A')}</td>
                                <td>{`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</td>
                                <td>{`${appointment.address_name} ${appointment.address2_name ? appointment.address2_name : ''}, ${appointment.city} ${appointment.state} ${appointment.zip}`}</td>
                                <td>
                                    <p onClick={(e) => {
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
                    <th>#</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Office</th>

                </tr>
            </thead>
            <tbody>
                {
                    appointments.map((appointment, idx) => {
                        return (moment(appointment.availability_date).isBefore(new Date) ? (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{moment(appointment.availability_date).format('MM/DD/YYYY')}</td>
                                <td>{moment(appointment.availability_from_time, 'hh:mm:ss').format('hh:mm A')}</td>
                                <td>{`${appointment.doctor_first_name} ${appointment.doctor_last_name}`}</td>
                                <td>{`${appointment.address_name} ${appointment.address2_name ? appointment.address2_name : ''}, ${appointment.city} ${appointment.state} ${appointment.zip}`}</td>
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
        <div>
            <h1>Welcome {patient.patient_first_name} {patient.patient_last_name}</h1>
            {
                appointmentLoading ? <Loading /> :
                    (
                        appointments.length <= 0 ? <h3>No Appointments</h3> :
                            (
                                <>
                                    <h2>Upcoming Appointment</h2>
                                    {UpcomingAppointment()}
                                    <h2>Appointment History</h2>
                                    {pastAppointment()}
                                </>
                            )
                    )
            }

            <Link to="/schedule">Schedule An Appointment</Link>

        </div>
    )
}

export default PatientDashboardComponent


// appointment_id(pin):"54639a21-6dbc-4e44-b93b-4fb813d11d97"
// appointment_patient(pin):"31a248c0-2d15-4fe0-81b9-df1ccfed9ef0"
// appointment_primary(pin):true
// appointment_reason(pin):"sick"
// appointment_availability(pin):"77042540-6041-43fe-b6a4-e283e8ad59af"
// availability_id(pin):"77042540-6041-43fe-b6a4-e283e8ad59af"
// doctor_id(pin):"ffcc6c59-112c-4cfb-94dd-1b5d9aba620d"
// office_id(pin):"b629f3da-8eca-4ecd-b056-b033308384a8"
// availability_date(pin):"2020-04-13T05:00:00.000Z"
// availability_from_time(pin):"10:00:00"
// availability_to_time(pin):"11:00:00"
// availability_taken(pin):true
// doctor_primary(pin):true
// doctor_address(pin):"92d5cd19-57cd-4c27-ad54-5e7fb565e481"
// doctor_first_name(pin):"Sarah"
// doctor_last_name(pin):"Hancock"
// doctor_email(pin):"shancock@APlusCare.com"
// doctor_phone_number(pin):"4156842594"
// doctor_office(pin):"b9fee75b-5fa2-4b3a-9e81-97ebb8eb4350"
// doctor_specialty(pin):"Primary"
// doctor_user(pin):"c92bb4f6-5827-4a7c-b2f6-4e801fb7a005"
// doctor_diagnosis(pin):null
// doctor_test(pin):null
// office_capacity(pin):1000
// office_address(pin):"97e5ecf3-31ef-4f28-9543-8a3bc65407c2"
// office_phone_number(pin):"281-993-3434"
// address_id(pin):"97e5ecf3-31ef-4f28-9543-8a3bc65407c2"
// address_name(pin):"1111 TestUser Dr, APT 3"
// address2_name(pin):null
// city(pin):"TestUserCity"
// state(pin):"TX"
// zip(pin):333
