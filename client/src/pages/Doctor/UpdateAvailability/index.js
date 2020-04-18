import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
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
    const updateAvailability = useStoreActions(actions => actions.doctor.updateAvailability);

    useEffect(() => {
        getAllAvailability(doctorID.doctor_id)
    }, []);

    useEffect(() => {
        getOffices();
    }, []);

    return (<Table striped bordered hover >
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
                                        const data = { doctorID: availability.doctor_id, date: availability.availability_date };
                                        updateAvailability(data)
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
    )
};

export default UpdateAvailability;
