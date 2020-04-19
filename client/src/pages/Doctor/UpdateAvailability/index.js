import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, ListGroup, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading';
//import Loading from 'src/components/Loading';
import './UpdateAvailability.css';

const UpdateAvailability = () => {

    const availability = useStoreState(state => state.doctor.allAvailability);
    // const updateAvailability = useStoreActions(actions => actions.doctor.updateAvailability);
    const getAllAvailability = useStoreActions(actions => actions.doctor.getAllAvailability);
    const getOffices = useStoreActions((actions) => actions.doctor.getOffices);
    const offices = useStoreState((state) => state.doctor.offices);
    const doctorID = useStoreState(state => state.auth.user)
    const loading = useStoreState((state) => state.doctor.loading);
    const cancelAvailability = useStoreActions(actions => actions.doctor.cancelAvailability);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    useEffect(() => {
        getAllAvailability(doctorID.doctor_id)
        getOffices();
    }, [doctorID.doctor_id, getAllAvailability, getOffices]);

    const onChange = (e) => {
        setUpdateInfo({ ...updateInfo, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // details.patientID = patientID.patient_id
        // updatePatient(details);
        setShow(false)
    }

    const [updateInfo, setUpdateInfo] = useState({
        officeID: '',
        date: '',
        newDate: '',
        newOffice: ''
    });

    const { officeID, date, newDate, newOffice } = updateInfo;

    return (
        <>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>Office</th>
                        <th>Date</th>
                        <th>Update</th>
                        <th>Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? <Loading /> : (

                            availability.map((availability, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td>{`${availability.address_name} ${availability.address2_name ? availability.address2_name : ''}, ${availability.city} ${availability.state} ${availability.zip}`}</td>
                                        <td>{moment(availability.availability_date).format('MM/DD/YYYY')}</td>
                                        <td>
                                            <Link className="cancelApp badge badge-success" onClick={(e) => {
                                                e.preventDefault();
                                                setUpdateInfo({
                                                    officeID: availability.office_id,
                                                    date: availability.availability_date
                                                });
                                                setShow(true);
                                            }}>Update</Link>
                                        </td>
                                        <td>
                                            <Link className="cancelApp badge badge-danger" onClick={(e) => {
                                                e.preventDefault();
                                                const data = { doctorID: availability.doctor_id, date: availability.availability_date };
                                                cancelAvailability(data)
                                            }}>Cancel</Link>
                                        </td>

                                    </tr>
                                );
                            })
                        )
                    }
                </tbody>
            </Table >
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => onSubmit(e)} >
                        <Form.Group >
                            <Form.Control as = "select"
                                value={newOffice}
                                key={newOffice}
                                onChange={(e) => onChange(e)} >
                                <option value="Office" > Office </option> 
                                {
                                    offices.map((office) => {
                                        return (< option value={office.office_id}
                                            key={office.office_id} > {`${office.address_name} ${
                                                office.address2_name
                                                    ? office.address2_name
                                                    : ''
                                                }, ${office.city} ${
                                                office.state
                                                } ${office.zip}`}
                                        </option>
                                        );
                                    })
                                } </Form.Control>
                        </Form.Group>
                        <Form.Group >
                            <Form.Control
                                type="date"
                                placeholder="MM-DD-YYYY"
                                name="availabilityDate"
                                value={newDate}
                                onChange={(e) => onChange(e)}
                                required
                            />
                        </Form.Group>

                        <input type="submit"
                            className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
                            value="Update" />
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
};

export default UpdateAvailability;
