import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import moment from 'moment';
import { Button, Container, ListGroup, Modal, Table } from 'react-bootstrap';
import './UpdateAvailability.css';

const UpdateAvailability = () => {

	const availability = useStoreState(state => state.doctor.availability);
    const updateAvailability = useStoreActions(actions => actions.doctor.updateAvailability);
    const getOffices = useStoreActions((actions) => actions.doctor.getOffices);
	const offices = useStoreState((state) => state.doctor.offices);

    const loading = useStoreState((state) => state.auth.loading);
    
    useEffect(() => {
        updateAvailability()
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
			</tr>
		</thead>
		<tbody>
            {
                availability.map((availability, idx) => {
                    return  (
                        <tr key={idx}>
                        <td>{`${availability.address_name} ${availability.address2_name ? availability.address2_name : ''}, ${availability.city} ${availability.state} ${availability.zip}`}</td>                            <td>{moment(availability.availability_date).format('MM/DD/YYYY')}</td>
                        </tr>
                    );
                })
            }
        </tbody>
    </Table >
    )
};

export default UpdateAvailability;
