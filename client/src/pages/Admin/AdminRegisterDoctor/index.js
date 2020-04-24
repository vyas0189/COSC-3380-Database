/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import './AdminRegisterDoctor.css';

const AdminRegisterDoctor = () => {
	const register = useStoreActions((actions) => actions.admin.registerDoctor);
	const getOffices = useStoreActions((actions) => actions.admin.getOffices);

	const offices = useStoreState((state) => state.admin.offices);
	const loading = useStoreState((state) => state.auth.loading);

	useEffect(() => {
		getOffices();
	}, []);

	const [formData, setFormData] = useState({
		username: '',
		password: '',
		role: '',
		email: '',
		firstName: '',
		lastName: '',
		address: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
		phoneNumber: '',
		primary: '',
		office: '',
		specialty: '',
	});

	const {
		username,
		password,
		email,
		firstName,
		lastName,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
		primary,
		office,
		specialty,
	} = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const userRegister = {
			username,
			password,
			email,
			firstName,
			lastName,
			address,
			address2,
			city,
			state,
			zip,
			phoneNumber,
			primary,
			office,
			specialty,
		};
		register(userRegister);
		setFormData({
			username: '',
			password: '',
			role: '',
			email: '',
			firstName: '',
			lastName: '',
			address: '',
			address2: '',
			city: '',
			state: '',
			zip: '',
			phoneNumber: '',
			primary: '',
			office: '',
			specialty: '',
		});
	};

	return loading ? (
		<Loading />
	) : (
		<Fragment>
			<div className="container-fluid">
				<div className="row no-gutter">
					<div className="d-none d-md-flex col-md-4 col-lg-6 bg-admin-dashboard"></div>
					<div className="col-md-8 col-lg-6">
						<div className="login d-flex align-items-center py-5">
							<div className="container">
								<div className="row">
									<div className="col-md-9 col-lg-4 mx-auto">
										<h3 className="login-heading mb-4">Register</h3>
										<form
											className="form"
											onSubmit={(e) => onSubmit(e)}
										>
											<div className="form-group">
												<input
													type="text"
													placeholder="Username"
													name="username"
													value={username}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<input
													type="password"
													placeholder="Password"
													name="password"
													value={password}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													minLength="6"
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="Email"
													name="email"
													value={email}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="First Name"
													name="firstName"
													value={firstName}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="Last Name"
													name="lastName"
													value={lastName}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="Primary Address"
													name="address"
													value={address}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="Secondary Address (APT#)"
													name="address2"
													value={address2}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="City"
													name="city"
													value={city}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>

											<div className="form-group">
												<select
													name="state"
													value={state}
													key={state}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												>
													<option value="State">
														Choose a State
													</option>
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
												</select>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="Zip"
													name="zip"
													value={zip}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="Phone (XXXXXXXXXX)"
													name="phoneNumber"
													value={phoneNumber}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<select
													name="office"
													value={office}
													key={office}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												>
													<option value="Office">Office</option>
													{offices.map((office, idx) => {
														return (
															<option value={office.office_id}>
																{`${office.address_name} ${
																	office.address2_name
																		? office.address2_name
																		: ''
																}, ${office.city} ${
																	office.state
																} ${office.zip}`}
															</option>
														);
													})}
												</select>
											</div>
											<div className="form-group">
												<select
													name="primary"
													value={primary}
													key={primary}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												>
													<option value="primary">
														Primary Doctor
													</option>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</select>
											</div>
											<div className="form-group">
												<select
													name="specialty"
													value={specialty}
													key={specialty}
													className="form-control"
													autoFocus
													onChange={(e) => onChange(e)}
												>
													<option value="specialty">
														Choose a Specialty
													</option>
													<option value="Primary">Primary</option>
													<option value="Cardiac">Cardiac</option>
													<option value="Pulmonary">
														Pulmonary
													</option>
													<option value="Neurology">
														Neurology
													</option>
												</select>
											</div>

											<input
												type="submit"
												className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
												value="Register"
											/>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default AdminRegisterDoctor;
