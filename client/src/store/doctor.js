import axios from 'axios';
import { toast } from 'react-toastify';
import { action, thunk } from 'easy-peasy';

const doctorModel = {
	loading: true,

	//offices
	offices: [],
	officeErr: null,

	//patients
	patients: [],
	patientErr: null,

	//diagnoses
	diagnoses: [],
	diagnosesErr: null,

	availabilityErr: null,
	testErr: null,

	getOffices: thunk(async (action, payload) => {
		action.setOfficesError(null);
		action.setLoading(true);

		try {
			const res = await axios.get('/api/doctor/get/offices');
			if (res.status === 200) {
				action.setOffices(res.data.offices);
			}
		} catch (error) {
			action.setOfficesError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getPatients: thunk(async (action) => {
		action.setPatientsError(null);
		action.setLoading(true);

		try {
			const res = await axios.get(`/api/doctor/get/patients`);
			console.log(res.data);

			if (res.status === 200) {
				action.setPatients(res.data.patients);
			}
		} catch (error) {
			action.setPatientsError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	getDiagnoses: thunk(async (action) => {
		action.setDiagnosesError(null);
		action.setLoading(true);

		try {
			const res = await axios.get(`/api/doctor/get/diagnoses`);
			console.log(res.data);

			if (res.status === 200) {
				action.setDiagnoses(res.data.diagnoses);
			}
		} catch (error) {
			action.setDiagnosesError(error.response.data.message);
		}
		action.setLoading(false);
	}),

	updateDiagnosis: thunk(
		async (action, { patientID, diagnosisID }, { getState }) => {
			action.setDiagnosesError(null);
			action.isLoading(true);

			try {
				const res = await axios.put('/api/doctor/update/diagnosis', {
					patientID,
					diagnosisID,
				});

				if (res.status === 200) {
					toast.success('Diagnosis updated!');
				}
			} catch (error) {
				action.setDiagnosesError(error.response.data.message);
				toast.error(error.response.data.message);
			}
			action.isLoading(false);
		}
	),

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

	orderTest: thunk(
		async (action, { patientID, scan, physical, blood }, { getState }) => {
			action.setTestError(null);
			action.isLoading(true);

			try {
				const res = await axios.post('/api/doctor/order/test', {
					patientID,
					scan,
					physical,
					blood,
				});

				if (res.status === 200) {
					toast.success('Test(s) ordered!');
				}
			} catch (error) {
				action.setTestError(error.response.data.message);
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

	setDiagnoses: action((state, diagnoses) => {
		state.diagnoses = diagnoses;
	}),

	setDiagnosesError: action((state, error) => {
		state.diagnosesErr = error;
	}),

	setAvailabilityError: action((state, error) => {
		state.availabilityErr = error;
	}),

	setTestError: action((state, error) => {
		state.testErr = error;
	}),
};
export default doctorModel;
