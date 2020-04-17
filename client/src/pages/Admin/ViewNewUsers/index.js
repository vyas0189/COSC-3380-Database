import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { Fragment, useEffect, useState } from 'react';
import './ViewNewUsers.css';

const RegisterComponent = () => {
	const admin = useStoreState((state) => state.auth.user);

	const getNewUsers = useStoreActions((actions) => actions.admin.getNewUsers);
	
	const newUsers = useStoreState((state) => state.admin.newUsers);

	useEffect(() => {
		getNewUsers();
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

			<form
				className="form"
				onSubmit={(e) => onSubmit(e)}
			>
				<div className="form-group">
					<input
						type="date"
						placeholder="Start Date"
						name="startDate"
						value={startDate}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>

				<div className="form-group">
					<input
						type="date"
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

		</Fragment>
	);
};

export default RegisterComponent;
