import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { toast } from 'react-toastify';

const doctorModel = {
	loading: false,

	//offices
	offices: [],
	officeErr: null,

	//patients
	patients: [],
	patientErr: null,

	availabilityErr: null,

	getOffices: thunk(async (action, payload) => {
		action.setOfficesError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/doctor/get/offices', {
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

	getPatients: thunk(async (action, payload) => {
		action.setPatientsError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/doctor/get/patients', {
				headers: {
					jwt_token: payload,
				},
			});
			if (res.status === 200) {
				action.setPatients(res.data.patients);
			}
		} catch (error) {
			action.setPatientsError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	//doesn't work
	addAvailability: thunk(
		async (action, { officeID, availabilityDate }, { getState }) => {
			action.setAvailabilityError(null);
			action.isLoading(true);

			try {
				const res = await axios.put(
					'/api/doctor/add/availability',
					{ officeID, availabilityDate },
					{
						headers: {
							jwt_token: getState().token,
						},
					}
				);

				if (res.status === 200) {
					toast.success('Availability added!');
				}
			} catch (error) {
				action.setAvailabilityError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

	isLoading: action((state, loading) => {
		state.loading = loading;
	}),

	setLoading: action((state, loading) => {
		state.loading = loading;
	}),

	setOffices: action((state, offices) => {
		state.offices = offices;
	}),

	setOfficesError: action((state, error) => {
		state.officeErr = error;
	}),

	setPatients: action((state, patients) => {
		state.patients = patients;
	}),

	setPatientsError: action((state, error) => {
		state.patientErr = error;
	}),

	setAvailabilityError: action((state, error) => {
		state.availabilityErr = error;
	}),
};
export default doctorModel;
