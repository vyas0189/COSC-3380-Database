import React from 'react';
import { Nav } from 'react-bootstrap';

const PatientScheduleComponent = () => {
    
    return (
        <div className="container mt-5" >
            <Nav variant="tabs" defaultActiveKey="primary">
                <Nav.Item>
                    <Nav.Link eventKey="primary">Schedule Primary</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="specialist">Schedule Specialist</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default PatientScheduleComponent
