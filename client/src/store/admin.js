import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { toast } from 'react-toastify';

const adminModel = {
	loading: false,
	offices: [],
	officeErr: null,

	getOffices: thunk(async (action, payload) => {
		action.setOfficesError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/admin/view/offices', {
				headers: {
					jwt_token: payload,
				},
			});
			if (res.status === 200) {
				action.setOffices(res.data.offices);
			}
		} catch (error) {
			action.setOfficesError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	updateDoctorProfile: thunk(
		async (
			action,
			{ doctorID, primary, specialty, office },
			{ getState }
		) => {
			action.setError(null);
			action.isLoading(true);

			try {
				const res = await axios.put(
					'/api/admin/update/doctor',
					{ doctorID, primary, specialty, office },
					{
						headers: {
							jwt_token: getState().token,
						},
					}
				);

				if (res.status === 200) {
					action.setUser(res.data.doctor);
					toast.success('Profile Updated!');
				}
			} catch (error) {
				action.setError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

	viewNewUsers: thunk(
		async (action, { weekStartDate, weekEndDate }, { getState }) => {
			action.setError(null);
			action.isLoading(true);

			try {
				const res = await axios.get(
					'/api/admin/view/weeklyNewUsers',
					{ weekStartDate, weekEndDate },
					{
						headers: {
							jwt_token: getState().token,
						},
					}
				);

				// if (res.status === 200) {

				//     //don't know what to do here
				//     action.setUser(res.data.patient)
				//     toast.success('Profile Updated!')
				// }
			} catch (error) {
				action.setError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

	viewUpdatedUsers: thunk(
		async (action, { weekStartDate, weekEndDate }, { getState }) => {
			action.setError(null);
			action.isLoading(true);

			try {
				const res = await axios.get(
					'/api/admin/view/weeklyUpdatedUsers',
					{ weekStartDate, weekEndDate },
					{
						headers: {
							jwt_token: getState().token,
						},
					}
				);

				// if (res.status === 200) {

				//     //don't know what to do here
				//     action.setUser(res.data.patient)
				//     toast.success('Profile Updated!')
				// }
			} catch (error) {
				action.setError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

	setLoading: action((state, loading) => {
		state.loading = loading;
	}),

	setOffices: action((state, offices) => {
		state.offices = offices;
	}),

	setOfficesError: action((state, error) => {
		state.officeErr = error;
	}),
};
export default adminModel;
