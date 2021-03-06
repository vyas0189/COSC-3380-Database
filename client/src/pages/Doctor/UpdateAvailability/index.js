/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Form, Modal, Table } from 'react-bootstrap';
import Loading from '../../../components/Loading';
import './UpdateAvailability.css';

const UpdateAvailability = () => {

    const availability = useStoreState(state => state.doctor.allAvailability);
    const updateAvailability = useStoreActions(actions => actions.doctor.updateAvailability);
    const getAllAvailability = useStoreActions(actions => actions.doctor.getAllAvailability);
    const getOffices = useStoreActions((actions) => actions.doctor.getOffices);
    const offices = useStoreState((state) => state.doctor.offices);
    const doctorID = useStoreState(state => state.auth.user)
    const loading = useStoreState((state) => state.doctor.loading);
    const cancelAvailability = useStoreActions(actions => actions.doctor.cancelAvailability);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setUpdateInfo({
            officeID: '',
            date: '',
            newDate: '',
        })
        setShow(false);
    }

    useEffect(() => {
        getAllAvailability(doctorID.doctor_id)
        getOffices();
    }, []);

    const onChange = (e) => {
        setUpdateInfo({ ...updateInfo, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let updatedNewDate;
        if (!newDate || newDate.length === 0) {
            updatedNewDate = date
        } else {
            updatedNewDate = newDate
        }

        const updatedData = {
            newDate: updatedNewDate,
            officeID,
            date,
            doctorID: doctorID.doctor_id
        }
        updateAvailability(updatedData)
        setShow(false)
    }

    const [updateInfo, setUpdateInfo] = useState({
        officeID: '',
        date: '',
        newDate: '',
        newOffice: ''
    });

    const { officeID, date, newDate } = updateInfo;

    return (
        <Container>
            {
                loading ? <Loading /> : (
                    <Fragment>
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
                                                        <a className="cancelApp badge badge-success" onClick={(e) => {
                                                            e.preventDefault();
                                                            setUpdateInfo({
                                                                officeID: availability.office_id,
                                                                date: availability.availability_date
                                                            });
                                                            setShow(true);
                                                        }}>Update</a>
                                                    </td>
                                                    <td>
                                                        <a className="cancelApp badge badge-danger" onClick={(e) => {
                                                            e.preventDefault();
                                                            const data = { doctorID: availability.doctor_id, date: availability.availability_date };
                                                            cancelAvailability(data)
                                                        }}>Cancel</a>
                                                    </td>

                                                </tr>
                                            );
                                        })
                                    )
                                }
                            </tbody>
                        </Table >
                    </Fragment>
                )
            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => onSubmit(e)} >
                        <Form.Group >
                            <Form.Control as="select"
                                name="officeID"
                                value={officeID}
                                key={officeID}
                                onChange={(e) => onChange(e)} >
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
                                name="newDate"
                                value={!newDate || newDate.length === 0 ? moment(date).format('YYYY-MM-DD') : moment(newDate).format('YYYY-MM-DD')}
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
        </Container>
    )
};

export default UpdateAvailability;
