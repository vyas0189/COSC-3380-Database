import axios from 'axios';
import { action, thunk } from 'easy-peasy';
import { toast } from 'react-toastify';
const doctorModel = {
	loading: true,

	//offices
	offices: [],
	officeErr: null,
	//schedule
	availability: [],
	allAvailability: [],

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

	addAvailability: thunk(
		async (
			action, {
				officeID,
				availabilityDate,
			}
		) => {
			action.setAvailabilityError(null);
			action.setLoading(true);
			try {
				const res = await axios.post('/api/doctor/add/availability', {
					officeID,
					availabilityDate,
				});

				if (res.status === 200) {
					toast.success('Schedule Added!');
				}

			} catch (err) {
				const errArr = []
				if (err.response.status === 401) {
					toast.error(err.response.data.message)
				} else {
					err.response.data.error.details.map(err => {
						return errArr.push(err.context.label);
					})
					action.setAvailabilityError(errArr.join('\n'))
					toast.error(errArr.join('\n'))
				}
			}
			action.setLoading(false);
		}
	),

	getAllAvailability: thunk(async (action, payload) => {
		action.setAllAvailabilityErr(null)
		action.setLoading(true)
		const doctorID = payload;

		try {
			const res = await axios.get(`/api/doctor/allAvailability/${doctorID}`);
			if (res.status === 200) {
				action.setAllAvailability(res.data.availabilities)
				action.getAvailability(res.data.availability)
			}
		} catch (error) {
			action.setAllAvailabilityErr(error.response.message)
		}
		action.setLoading(false)
	}),

	updateAvailability: thunk(async (action, { newDate, officeID, doctorID, date, }) => {
		action.setAvailabilityError(null)
		action.setLoading(true)

		try {
			const res = await axios.put('/api/doctor/updateAvailability', {
				newDate, officeID, doctorID, date,
			});
			if (res.status === 200) {
				toast.success('Availability Updated');
				action.getAllAvailability(doctorID)
			}
		} catch (error) {
			// action.setAvailabilityError(errArr.join('\n'))
			toast.error('Unable to Update Availability');
		}
		action.setLoading(false)
	}),
	cancelAvailability: thunk(async (action, { doctorID, date }) => {
		action.setLoading(true);

		try {
			const res = await axios.delete('/api/doctor/cancelAvailability', {
				data: { doctorID, date }
			})

			if (res.status === 200) {
				toast.success('Availability Cancelled');
				action.getAllAvailability(doctorID)
			}
		} catch (error) {
			toast.error(error.response.message);
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

	setAvailability: action((state, availability) => {
		state.availability = availability;
	}),

	setAvailabilityError: action((state, error) => {
		state.availabilityErr = error;
	}),

	getAvailability: action((state, availability) => {
		state.availability = availability
	}),

	setAllAvailability: action((state, availability) => {
		state.allAvailability = availability;
	}),

	setAllAvailabilityErr: action((state, error) => {
		state.allAvailabilityErr = error;
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

	setTestError: action((state, error) => {
		state.testErr = error;
	}),
};
export default doctorModel;