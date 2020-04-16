import { useStoreActions } from 'easy-peasy';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const RegisterComponent = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		email: '',
		firstName: '',
		lastName: '',
		address: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
		phoneNumber: '',
		dob: '',
		gender: '',
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
		dob,
		gender,
	} = formData;

	const register = useStoreActions((actions) => actions.auth.registerPatient);
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
			dob,
			gender,
		};
		register(userRegister);
	};

	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row no-gutter">
					<div className="d-none d-md-flex col-md-4 col-lg-6 bg-patient-register"></div>
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
											<div className="form-label-group">
												<input
													type="text"
													id="inputUsername"
													className="form-control"
													placeholder="Username"
													name="username"
													value={username}
													onChange={(e) => onChange(e)}
													required
													autoFocus
												/>
												<label htmlFor="inputUsername">
													Username
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="password"
													id="inputPassword"
													className="form-control"
													placeholder="Password"
													name="password"
													value={password}
													onChange={(e) => onChange(e)}
													minLength="6"
												/>
												<label htmlFor="inputPassword">
													Password
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputEmail"
													className="form-control"
													placeholder="Email"
													name="email"
													value={email}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputEmail">
													Email
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputFirstName"
													className="form-control"
													placeholder="First Name"
													name="firstName"
													value={firstName}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputFirstName">
													First Name
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputLastName"
													className="form-control"
													placeholder="Last Name"
													name="lastName"
													value={lastName}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputLastName">
													Last Name
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputPrimaryAddress"
													className="form-control"
													placeholder="Primary Address"
													name="address"
													value={address}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputPrimaryAddress">
													Primary Address
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputSecondaryAddress"
													className="form-control"
													placeholder="Secondary Address (APT#)"
													name="address2"
													value={address2}
													onChange={(e) => onChange(e)}
												/>
												<label htmlFor="inputSecondaryAddress">
													Secondary Address (APT #)
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputCity"
													className="form-control"
													placeholder="City"
													name="city"
													value={city}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputCity">
													City
												</label>
											</div>

											<div className="form-label-group">
												<select
													name="state"
													id="inputState"
													className="form-control"
													value={state}
													key={state}
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
											<div className="form-label-group">
												<input
													type="number"
													id="inputZip"
													className="form-control"
													placeholder="Zip"
													name="zip"
													value={zip}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputZip">
													Zip
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="text"
													id="inputPhone"
													className="form-control"
													placeholder="Phone (XXXXXXXXXX)"
													name="phoneNumber"
													value={phoneNumber}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputPhone">
													Phone (XXXXXXXXXX)
												</label>
											</div>
											<div className="form-label-group">
												<input
													type="date"
													id="inputDOB"
													className="form-control"
													placeholder="DOB (MM-DD-YYYY)"
													name="dob"
													value={dob}
													onChange={(e) => onChange(e)}
													required
												/>
												<label htmlFor="inputDOB">
													Date of Birth
												</label>
											</div>
											<div className="form-label-group">
												<select
													name="gender"
													id="inputSex"
													className="form-control"
													value={gender}
													key={gender}
													onChange={(e) => onChange(e)}
												>
													<option value="Gender">Sex</option>
													<option value="M">M</option>
													<option value="F">F</option>
													<option value="Other">Other</option>
												</select>

											</div>


											<button
												className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
												type="submit"
											>
												Register
											</button>
										</form>
										<p className="my-1">
											Already have an account?{' '}
											<Link to="/login">Login</Link>
										</p>
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

export default RegisterComponent;
