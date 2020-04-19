/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreActions, useStoreState } from 'easy-peasy';
import { MDBDataTable } from 'mdbreact';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Loading from '../../../../Loading';
const PatientPrimaryScheduleComponent = () => {

    const formatPhoneNumber = (phoneNumberString) => {
        const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            const intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
        return null
    }

    const getPrimaryAppointments = useStoreActions(actions => actions.patient.getPrimaryAppointmentAvailability);
    const loading = useStoreState(state => state.patient.primaryAppointmentLoading);
    const primaryAvailability = useStoreState(state => state.patient.primaryAppointmentAvailability)
    const getCurrentPrimaryCount = useStoreActions(actions => actions.patient.getCurrentPrimaryCount)
    const patientID = useStoreState(state => state.auth.user);
    const currentPrimary = useStoreState(state => state.patient.currentPrimary);
    const schedulePrimary = useStoreActions(actions => actions.patient.schedulePrimaryAppointment);
    const [show, setShow] = useState(false);
    const [primaryDetails, setDetails] = useState({
        availability_id: '',
        availability_date: '',
        availability_from_time: '',
        doctor_last_name: '',
        address_name: '',
        address2_name: '',
        state: '',
        zip: '',
        city: '',
        doctor_first_name: '',
    });

    const {
        availability_id,
        availability_date,
        availability_from_time,
        doctor_last_name,
        address_name,
        address2_name,
        state,
        zip,
        city,
        doctor_first_name,
    } = primaryDetails;
    const [reasonPrimary, setReason] = useState('');
    const handleChange = (e) => setReason(e.target.value)
    const history = useHistory()
    const handleClose = () => {
        setShow(false);
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        schedulePrimary({ primaryAppointment: true, reason: reasonPrimary, availabilityID: availability_id });
        setDetails({
            availability_id: '',
            availability_date: '',
            availability_from_time: '',
            doctor_last_name: '',
            address_name: '',
            address2_name: '',
            state: '',
            zip: '',
            city: '',
            doctor_first_name: '',
        })
        setShow(false);
        history.push('/dashboard');
    }
    const handleShow = () => {
        setShow(true);
    };

    useEffect(() => {
        getCurrentPrimaryCount(patientID.patient_id)
        getPrimaryAppointments();
    }, []);
    const setDataTable = () => {
        let rows = []
        rows.push(primaryAvailability.map((appointment) => {
            const {
                availability_id,
                availability_date,
                availability_from_time,
                doctor_last_name,
                address_name,
                address2_name,
                state,
                zip,
                doctor_first_name,
                city,
                office_phone_number,
            } = appointment
            if (moment(availability_date).isAfter(new Date())) {
                return {
                    date: moment(availability_date).format('MM/DD/YYYY'),
                    time: moment(availability_from_time, 'hh:mm:ss').format('hh:mm A'),
                    doctor: `${doctor_first_name} ${doctor_last_name}`,
                    office: `${address_name} ${address2_name ? address2_name : ''}, ${city} ${state} ${zip}`,
                    office_number: formatPhoneNumber(office_phone_number),
                    schedule: (<Button className="badge badge-success" onClick={(e) => {
                        e.preventDefault()
                        setDetails({
                            ...primaryDetails,
                            availability_id,
                            availability_date,
                            availability_from_time,
                            doctor_last_name,
                            address_name,
                            address2_name,
                            state,
                            zip,
                            doctor_first_name,
                            city,
                        })
                        handleShow()
                    }}>Schedule</Button>)
                }
            } else { return null }
        }))
        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'date',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'Time',
                    field: 'time',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'Doctor',
                    field: 'doctor',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'Office',
                    field: 'office',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'Office Number',
                    field: 'office_number',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'Schedule',
                    field: 'schedule',
                    width: 150,
                }
            ],
            rows: rows[0].reverse(),
        };
        return <MDBDataTable striped bordered data={data} />
    }


    return (
        <div>

            {loading ? <Loading /> : currentPrimary ? <h3>You have already booked an Primary Appointment.</h3> : (

                <div style={{ marginTop: '1.2rem' }}>
                    {setDataTable()}
                </div>
            )}


            <Modal show={show} onHide={handleClose}>

                <>
                    < Modal.Header closeButton>
                        <Modal.Title>Appointment Conformation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Date: {moment(availability_date).format('MM/DD/YYYY')}</ListGroup.Item>
                            <ListGroup.Item>Time: {moment(availability_from_time, 'hh:mm:ss').format('hh:mm A')}</ListGroup.Item>
                            <ListGroup.Item>Doctor: {`${doctor_first_name} ${doctor_last_name}`}</ListGroup.Item>
                            <ListGroup.Item>Office: {`${address_name} ${address2_name ? address2_name : ''}, ${city} ${state} ${zip}`}</ListGroup.Item>
                            <ListGroup.Item>
                                <Form onSubmit={(e) => handleSubmit(e)}>
                                    <Form.Group controlId="reasonForm.ControlTextarea1">
                                        <Form.Label>Reason*</Form.Label>
                                        <Form.Control required as="textarea" rows="3" onChange={handleChange} />
                                    </Form.Group>
                                    <Button type="submit">Confirm</Button>
                                </Form>
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                </>

            </Modal>

        </div>
    )
}

export default PatientPrimaryScheduleComponent;