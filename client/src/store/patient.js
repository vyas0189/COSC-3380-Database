import axios from "axios";
import { action, thunk } from "easy-peasy";
import { toast } from 'react-toastify';

const patientModel = {
    appointmentLoading: true,
    appointments: [],
    appointmentErr: null,
    appointmentDetails: [],
    appointmentDetailsLoading: true,
    primaryAppointmentAvailability: [],
    specialistAppointmentAvailability: [],
    detailsLoading: true,
    patientDetails: null,
    currentPrimary: false,
    primaryAppointmentLoading: true,

    updatePatient: thunk(async (action, { patientID, firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender, address2 }) => {
        action.setAppointmentError(null);
        action.setDetailsLoading(true);
        try {
            if (!address2.length) {
                address2 = 'n/a'
            }
            const res = await axios.put('/api/patient/update', { firstName, lastName, email, address, city, state, zip, phoneNumber, dob, gender, address2 })

            if (res.status === 200) {
                action.getPatientDetails(patientID)
                toast.success('Profile Updated!')
            }
        } catch (error) {
            const errArr = []
            error.response.data.error.details.map(err => {
                return errArr.push(err.context.label);
            })
            toast.error(errArr.join('\n'))
        }
        action.setDetailsLoading(false)
    }),

    getPatientDetails: thunk(async (action, patientID) => {
        action.setAppointmentError(null)
        action.setDetailsLoading(true);
        try {

            const res = await axios.get(`/api/patient/info/${patientID}`);

            if (res.status === 200) {
                action.setInfo(res.data.patientInfo);
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message)
        }
        action.setDetailsLoading(false)
    }),

    getAppointments: thunk(async (action) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.get('/api/appointment/view/myAppointments');
            if (res.status === 200) {
                action.setAppointments(res.data.appointments)
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message)
        }
        action.setLoading(false)
    }),
    getCurrentPrimaryCount: thunk(async (action, patientID) => {
        action.setAppointmentError(null)
        action.setLoading(true)
        action.setCurrentPrimaryCount(false);
        try {

            const res = await axios.get(`/api/appointment/currentPrimaryAppointment/${patientID}`);

            if (res.status === 200) {
                if (+res.data.currentPrimary) {
                    action.setCurrentPrimaryCount(true);
                }
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message)
        }
        action.setLoading(false)
    }),
    schedulePrimaryAppointment: thunk(async (action, { primaryAppointment, reason, availabilityID }) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.post('/api/appointment/schedule/primaryAppointment', { primaryAppointment, reason, availabilityID });
            if (res.status === 200) {
                action.setCurrentPrimaryCount(true);
                action.getAppointments();
                toast.success('Appointment Scheduled!');
            }

        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }
        action.setLoading(false);
    }),

    scheduleSpecialistAppointment: thunk(async (action, { primaryAppointment, reason, availabilityID }) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.post('/api/appointment/schedule/specialistAppointment', { primaryAppointment, reason, availabilityID });
            if (res.status === 200) {
                action.getAppointments();
                toast.success('Appointment Scheduled!');
            }

        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }
        action.setLoading(false);
    }),

    getAppointmentDetails: thunk(async (action, { appointmentID }) => {
        action.setAppointmentError(null)

        action.setAppointmentDetailsLoading(true)
        try {
            const res = await axios.get(`/api/appointment/appointmentDetails/${appointmentID}`);
            if (res.status === 200) {
                action.setAppointmentsDetails(res.data.appointmentDetails)
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }

        action.setAppointmentDetailsLoading(false)
    }),

    cancelAppointment: thunk(async (action, { appointmentID }) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.delete('/api/appointment/cancel', {
                data: {
                    appointmentID
                }
            });
            if (res.status === 200) {
                toast.success('Appointment Canceled!');
                action.getAppointments()
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }
        action.setLoading(false);
    }),

    getPrimaryAppointmentAvailability: thunk(async (action) => {
        action.setAppointmentError(null)
        action.setPrimaryLoading(true)

        try {
            const res = await axios.get('/api/appointment/primaryAvailable');

            if (res.status === 200) {
                action.setPrimaryAppointmentAvailability(res.data.primaryAvailable);
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message);
        }
        action.setPrimaryLoading(false);
    }),
    getSpecialistAppointmentAvailability: thunk(async (action) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.get('/api/appointment/specialtyAvailable');

            if (res.status === 200) {
                action.setSpecialistAppointmentAvailability(res.data.specialtyAvailable);
            }
        } catch (error) {
            action.setAppointmentError(error.response);
        }
        action.setLoading(false);
    }),
    setLoading: action((state, loading) => {
        state.appointmentLoading = loading;
    }),
    setAppointmentDetailsLoading: action((state, loading) => {
        state.appointmentDetailsLoading = loading;
    }),
    setAppointments: action((state, appointments) => {
        state.appointments = appointments
    }),
    setAppointmentsDetails: action((state, appointments) => {
        state.appointmentDetails = appointments
    }),
    setAppointmentError: action((state, error) => {
        state.appointmentErr = error;
    }),
    setPrimaryAppointmentAvailability: action((state, availability) => {
        state.primaryAppointmentAvailability = availability;
    }),
    setSpecialistAppointmentAvailability: action((state, availability) => {
        state.specialistAppointmentAvailability = availability;
    }),
    setCurrentPrimaryCount: action((state, count) => {
        state.currentPrimary = count;
    }),
    setInfo: action((state, info) => {
        state.patientDetails = info;
    }),
    setDetailsLoading: action((state, loading) => {
        state.detailsLoading = loading;
    }),
    setPrimaryLoading: action((state, loading) => {
        state.primaryAppointmentLoading = loading;
    })

}
export default patientModel;