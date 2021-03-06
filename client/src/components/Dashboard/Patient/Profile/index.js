/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, ListGroup, Modal } from 'react-bootstrap';
import Loading from '../../../Loading';
import './Profile.css';

const PatientProfile = () => {
    const formatPhoneNumber = (phoneNumberString) => {
        const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            const intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
        return null
    }
    const getPatientDetails = useStoreActions(actions => actions.patient.getPatientDetails);
    const patientID = useStoreState(state => state.auth.user);
    const loading = useStoreState(state => state.patient.detailsLoading);
    const patientDetails = useStoreState(state => state.patient.patientDetails);
    const updatePatient = useStoreActions(actions => actions.patient.updatePatient);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    useEffect(() => {
        getPatientDetails(patientID.patient_id)
    }, []);

    const onChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        details.patientID = patientID.patient_id
        updatePatient(details);
        setShow(false)
    }
    const [details, setDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
    })

    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        address,
        address2,
        city,
        state,
        zip,
    } = details


    return (
        <>
            <div className="container-fluid">
                <div className="row no-gutter">
                    <div className="d-none d-md-flex col-md-4 col-lg-6 bg-patient-dashboard"></div>
                    <div className="col-md-8 col-lg-6">
                        <div className="login d-flex align-items-center py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-9 col-lg-8 mx-auto">
                                        <div className="profileContainer">
                                            {loading ? <Loading /> :
                                                (
                                                    <Card>
                                                        <ListGroup variant="flush">
                                                            <ListGroup.Item><strong>First Name: </strong>{patientDetails.patient_first_name}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Last Name: </strong> {patientDetails.patient_last_name}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Email: </strong> {patientDetails.patient_email}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Phone: </strong> {formatPhoneNumber(patientDetails.patient_phone_number)}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Date of Birth: </strong> {moment(patientDetails.patient_dob).format('MMMM Do YYYY')}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Gender: </strong> {patientDetails.patient_gender}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Primary Address: </strong> {patientDetails.address_name}</ListGroup.Item>
                                                            {patientDetails.address2_name && (
                                                                <ListGroup.Item>
                                                                    <strong>Secondary Address: </strong>
                                                                    {patientDetails.address2_name}
                                                                </ListGroup.Item>
                                                            )}
                                                            <ListGroup.Item><strong>City: </strong> {patientDetails.city}</ListGroup.Item>
                                                            <ListGroup.Item><strong>State: </strong> {patientDetails.state}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Zip: </strong> {patientDetails.zip}</ListGroup.Item>
                                                            <ListGroup.Item><Button className="primary editProfile" onClick={(e) => {
                                                                e.preventDefault();
                                                                setDetails({
                                                                    firstName: patientDetails.patient_first_name,
                                                                    lastName: patientDetails.patient_last_name,
                                                                    email: patientDetails.patient_email,
                                                                    phone_number: patientDetails.patient_phone_number,
                                                                    dob: patientDetails.patient_dob,
                                                                    gender: patientDetails.patient_gender,
                                                                    address: patientDetails.address_name,
                                                                    address2: patientDetails.address2_name,
                                                                    city: patientDetails.city,
                                                                    state: patientDetails.state,
                                                                    phoneNumber: patientDetails.patient_phone_number,
                                                                    zip: patientDetails.zip,
                                                                })
                                                                setShow(true);
                                                            }}>Edit Profile</Button></ListGroup.Item>
                                                        </ListGroup>
                                                    </Card>
                                                )
                                            }
                                        </div >
                                        <>
                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Edit Profile</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form
                                                        onSubmit={(e) => onSubmit(e)}
                                                    >
                                                        <Form.Group>
                                                            <Form.Label>Email address</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Email"
                                                                name="email"
                                                                value={email}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>First Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="First Name"
                                                                name="firstName"
                                                                value={firstName}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>Last Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Last Name"
                                                                name="lastName"
                                                                value={lastName}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>DOB</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                placeholder="DOB"
                                                                name="dob"
                                                                value={moment(dob).format('YYYY-MM-DD')}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>Primary Address</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Primary Address"
                                                                name="address"
                                                                value={address}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>Secondary Address</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Secondary Address (APT#)"
                                                                name="address2"
                                                                value={address2}
                                                                onChange={(e) => onChange(e)}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>City</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="City"
                                                                name="city"
                                                                value={city}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>

                                                        <Form.Group>
                                                            <Form.Label>State</Form.Label>
                                                            <Form.Control as="select"
                                                                name="state"
                                                                value={state}
                                                                key={state}
                                                                onChange={(e) => onChange(e)}
                                                            >
                                                                <option value="AL">AL</option>
                                                                <option value="AK">AK</option>
                                                                <option value="AR">AR</option>
                                                                <option value="AZ">AZ</option>
                                                                <option value="CA">CA</option>
                                                                <option value="CO">CO</option>
                                                                <option value="CT">CT</option>
                                                                <option value="DC">DC</option>
                                                                <option value="DE">DE</option>
                                                                <option value="FL">FL</option>
                                                                <option value="GA">GA</option>
                                                                <option value="HI">HI</option>
                                                                <option value="IA">IA</option>
                                                                <option value="ID">ID</option>
                                                                <option value="IL">IL</option>
                                                                <option value="IN">IN</option>
                                                                <option value="KS">KS</option>
                                                                <option value="KY">KY</option>
                                                                <option value="LA">LA</option>
                                                                <option value="MA">MA</option>
                                                                <option value="MD">MD</option>
                                                                <option value="ME">ME</option>
                                                                <option value="MI">MI</option>
                                                                <option value="MN">MN</option>
                                                                <option value="MO">MO</option>
                                                                <option value="MS">MS</option>
                                                                <option value="MT">MT</option>
                                                                <option value="NC">NC</option>
                                                                <option value="NE">NE</option>
                                                                <option value="NH">NH</option>
                                                                <option value="NJ">NJ</option>
                                                                <option value="NM">NM</option>
                                                                <option value="NV">NV</option>
                                                                <option value="NY">NY</option>
                                                                <option value="ND">ND</option>
                                                                <option value="OH">OH</option>
                                                                <option value="OK">OK</option>
                                                                <option value="OR">OR</option>
                                                                <option value="PA">PA</option>
                                                                <option value="RI">RI</option>
                                                                <option value="SC">SC</option>
                                                                <option value="SD">SD</option>
                                                                <option value="TN">TN</option>
                                                                <option value="TX">TX</option>
                                                                <option value="UT">UT</option>
                                                                <option value="VT">VT</option>
                                                                <option value="VA">VA</option>
                                                                <option value="WA">WA</option>
                                                                <option value="WI">WI</option>
                                                                <option value="WV">WV</option>
                                                                <option value="WY">WY</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>Zip</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Zip"
                                                                name="zip"
                                                                value={zip}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label>Phone Number (XXXXXXXXXX)</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Phone (XXXXXXXXXX)"
                                                                name="phoneNumber"
                                                                value={phoneNumber}
                                                                onChange={(e) => onChange(e)}
                                                                required
                                                            />
                                                        </Form.Group>

                                                        <Button
                                                            style={{ width: "100%" }}
                                                            type="submit"
                                                            variant="success"
                                                        >
                                                            Update
                            </Button>
                                                    </Form>
                                                </Modal.Body>
                                            </Modal>
                                        </>
                                        <div className="body text-center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PatientProfile
