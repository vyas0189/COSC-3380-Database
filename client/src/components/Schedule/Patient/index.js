import React, { useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import PatientPrimaryScheduleComponent from '../../Dashboard/Patient/Schedule/Primary';
import PatientSpecialistScheduleComponent from '../../Dashboard/Patient/Schedule/Specialist';
const PatientScheduleComponent = () => {

    const [key, setKey] = useState('primary');


    return (
        <Container className="mt-5">
            <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
                <Tab eventKey="primary" title="Primary">
                    <PatientPrimaryScheduleComponent />
                </Tab>
                <Tab eventKey="specialist" title="Specialist">
                    <PatientSpecialistScheduleComponent />
                </Tab>
            </Tabs>
        </Container>
    )
}

export default PatientScheduleComponent