import { useStoreActions } from 'easy-peasy';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import './ViewUpdatedUsers.css';

const RegisterComponent = () => {
	const [formData, setFormData] = useState({
		weekStartDate: '',
		weekEndDate: '',
	});

	const { weekStartDate, weekEndDate } = formData;

	const register = useStoreActions((actions) => actions.auth.viewUpdatedUsers);
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const userRegister = {
			weekStartDate,
			weekEndDate,
		};
		register(userRegister);
	};

	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row no-gutter">
					{/* <div className="d-none d-md-flex col-md-4 col-lg-6 bg-admin-dashboard"></div> */}
					<div className="col-md-8 col-lg-6">
						<div className="login d-flex align-items-center py-5">
							<div className="container">
								<div className="row">
									<div className="col-md-9 col-lg-4 mx-auto">
										<h3 className="login-heading mb-4">
											View Updated Users
										</h3>
										<form
											className="form"
											onSubmit={(e) => onSubmit(e)}
										>
											<div className="form-group">
												<input
													type="text"
													placeholder="Start Date"
													name="weekStartDate"
													value={weekStartDate}
													onChange={(e) => onChange(e)}
													required
												/>
											</div>

											<div className="form-group">
												<input
													type="text"
													placeholder="End Date"
													name="weekEndDate"
													value={weekEndDate}
													onChange={(e) => onChange(e)}
													required
												/>
											</div>

											<input
												type="submit"
												className="btn btn-sm btn-primary btn-register text-uppercase font-weight-bold mb-2"
												value="View"
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
