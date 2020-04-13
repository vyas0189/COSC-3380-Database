import { useStoreActions } from 'easy-peasy';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterOffice.css';

const RegisterComponent = () => {
	const [formData, setFormData] = useState({
		capacity: '',
		address: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
		phoneNumber: '',
	});

	const {
		capacity,
		address,
		address2,
		city,
		state,
		zip,
		phoneNumber,
	} = formData;

	const register = useStoreActions((actions) => actions.auth.registerOffice);
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const userRegister = {
			capacity,
			address,
			address2,
			city,
			state,
			zip,
			phoneNumber,
		};
		register(userRegister);
	};

	return (
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
													placeholder="Capacity"
													name="capacity"
													value={capacity}
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
													onChange={(e) => onChange(e)}
												/>
											</div>
											<div className="form-group">
												<input
													type="text"
													placeholder="City"
													name="city"
													value={city}
													onChange={(e) => onChange(e)}
													required
												/>
											</div>
											<div className="form-group">
												<div className="form-group">
													<select
														name="state"
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
												<div className="form-group">
													<input
														type="text"
														placeholder="Zip"
														name="zip"
														value={zip}
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
														onChange={(e) => onChange(e)}
														required
													/>
												</div>
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

export default RegisterComponent;
