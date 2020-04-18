import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import './UpdateAvailability.css';

const UpdateAvailability = () => {

    const availability = useStoreState(state => state.doctor.availability);
    // const updateAvailability = useStoreActions(actions => actions.doctor.updateAvailability);
    const getAllAvailability = useStoreActions(actions => actions.doctor.getAllAvailability);
    const getOffices = useStoreActions((actions) => actions.doctor.getOffices);
    const offices = useStoreState((state) => state.doctor.offices);
    const doctorID = useStoreState(state => state.auth.user)
    const loading = useStoreState((state) => state.doctor.loading);

    useEffect(() => {
        console.log(doctorID.doctor_id);
        // doctorID = doctorID.doctor_id
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
            </tr>
        </thead>
        <tbody>
            {
                loading ? <Loading/> :
                
                // availability.map((availability, idx) => {
                //     return (
                //         <tr key={idx}>
                //             <td>{`${availability.address_name} ${availability.address2_name ? availability.address2_name : ''}, ${availability.city} ${availability.state} ${availability.zip}`}</td>
                //             <td>{moment(availability.availability_date).format('MM/DD/YYYY')}</td>
                //         </tr>
                //     );
                // })
            }
        </tbody>
    </Table >
    )
};

export default UpdateAvailability;
