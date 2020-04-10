import { useStoreState } from 'easy-peasy';
import React from 'react';
import { Link } from 'react-router-dom';
import './Patient.css';

const PatientDashboardComponent = () => {

    const patient = useStoreState(state => state.auth.user);
    console.log(patient);

    const btnstyle = {
        color: 'red',
        height: '40px',
        background: 'white',
        borderRadius:10,
        borderWidth: 1,
        font: '1rem',
    }

    return (
        <header className = "pdm" >
            <div>
                <h1>Welcome {patient.patient_first_name} {patient.patient_last_name}</h1>
                <h2>Past Appointment(s) <button style = {btnstyle}>Check</button> </h2> 
                <h2>Upcoming Appointment(s) <button style = {btnstyle}>Check</button> </h2>
                {
                    patient.patient_primary_doctor ?
                        <button className="btn btn-success"> Schedule An Appointment with Primary Doctor</button> :
                        <button className="btn btn-success"> Schedule An Appointment with Primary Doctor</button> 
                }
                <br></br><br></br>
                {
                    patient.patient_primary_doctor ?
                        <button className="btn btn-success"> Cancel Appointment with Primary Doctor</button> :
                        <button className="btn btn-success"> Cancel Appointment with Primary Doctor</button> 
                }
            </div>
            <div className = "contactinfo">
                <h4>Contact us</h4>
                <h4>Call us at: (538)-743-8262</h4>
                <h4>Email us at: APlusCare@uh.edu</h4>
            </div>
        </header>     
    )
}

export default PatientDashboardComponent


// user_id(pin):"08190c99-39be-4a0d-bd3d-f183cd86339a"
// username(pin):"vyas0"
// password(pin):"$2a$10$./i.LzEXUcT0uXG468lk2Oy6EQ6eYfYgMnDnmUzBdsqEUXRCdPJCC"
// role(pin):"patient"
// created_at(pin):"2020-04-09T05:09:28.745Z"
// updated_at(pin):"2020-04-09T05:09:28.745Z"
// patient_id(pin):"6329a3c4-c152-4ff0-8edb-40d234703849"
// patient_first_name(pin):"Vyas"
// patient_last_name(pin):"Ramankulangara"
// patient_email(pin):"vyas0189@gmail.com"
// patient_phone_number(pin):"2815699763"
// patient_gender(pin):"M"
// patient_address(pin):"fc178f80-6c76-4da3-b72b-74fe407d32a0"
// patient_dob(pin):"1993-01-06T06:00:00.000Z"
// patient_user(pin):"08190c99-39be-4a0d-bd3d-f183cd86339a"
// patient_diagnosis(pin):null
// patient_primary_doctor(pin):null
// patient_doctor_specialty(pin):null