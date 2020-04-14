import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import './ViewNewUsers.css';

const RegisterComponent = () => {
	const admin = useStoreState((state) => state.auth.user);
	const token = useStoreState((state) => state.auth.token);
	const loading = useStoreState((state) => state.auth.loading);
	const getNewUsers = useStoreActions((actions) => actions.auth.getNewUsers);
	const newUsersLoading = useStoreState(
		(state) => state.admin.newUsersLoading
	);
	const adminToken = useStoreState((state) => state.auth.token);
	const newUsers = useStoreState((state) => state.admin.newUsers);

	useEffect(() => {
		getNewUsers(adminToken);
	}, []);

	const [formData, setFormData] = useState({
		startDate: '',
		endDate: '',
	});

	const { startDate, endDate } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		return (
			<div className="form-group">
				{newUsers.map(
					(newUser, idx) =>
						`${newUser.username} - ${newUser.role} - ${newUser.created_at}`
				)}
			</div>
		);
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
										<h3 className="login-heading mb-4">
											View New Users
										</h3>
										<form
											className="form"
											onSubmit={(e) => onSubmit(e)}
										>
											<div className="form-group">
												<input
													type="text"
													placeholder="Start Date"
													name="startDate"
													value={startDate}
													onChange={(e) => onChange(e)}
													required
												/>
											</div>

											<div className="form-group">
												<input
													type="text"
													placeholder="End Date"
													name="endDate"
													value={endDate}
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
