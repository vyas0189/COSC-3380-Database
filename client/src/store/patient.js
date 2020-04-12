import axios from "axios";
import { action, thunk } from "easy-peasy";
import { toast } from 'react-toastify';

const patientModel = {
    appointmentLoading: false,
    appointments: [],
    appointmentErr: null,

    getAppointments: thunk(async (action, payload) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.get('http://localhost:4000/api/appointment/view/myAppointments', {
                headers: {
                    'jwt_token': payload
                }
            });
            if (res.status === 200) {
                action.setAppointments(res.data.appointments)
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message)
        }
        action.setLoading(false)
    }),

    schedulePrimaryAppointment: thunk(async (action, { token, primaryAppointment, reason, availabilityID }, { getState }) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.post('http://localhost:4000/api/appointment/schedule/primaryAppointment', { primaryAppointment, reason, availabilityID }, {
                headers: {
                    'jwt_token': token
                }
            });
            if (res.status === 200) {
                toast.success('Appointment Scheduled!');
            }

        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }
        action.setLoading(false);
    }),

    scheduleSpecialistAppointment: thunk(async (action, { token, primaryAppointment, reason, availabilityID }, { getState }) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.post('http://localhost:4000/api/appointment/schedule/specialistAppointment', { primaryAppointment, reason, availabilityID }, {
                headers: {
                    'jwt_token': token
                }
            });
            if (res.status === 200) {
                toast.success('Appointment Scheduled!');
            }

        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }
        action.setLoading(false);
    }),

    cancelAppointment: thunk(async (action, { token, appointmentID }, { getState }) => {
        action.setAppointmentError(null)
        action.setLoading(true)

        try {
            const res = await axios.delete('http://localhost:4000/api/appointment/cancel', {
                headers: {
                    'jwt_token': token
                },
                data: {
                    appointmentID
                }
            });
            if (res.status === 200) {
                toast.success('Appointment Canceled!');
                action.getAppointments(token)
            }
        } catch (error) {
            action.setAppointmentError(error.response.data.message);
            toast.error(error.response.data.message)
        }
        action.setLoading(false);
    }),

    setLoading: action((state, loading) => {
        state.appointmentLoading = loading;
    }),

    setAppointments: action((state, appointments) => {
        state.appointments = appointments
    }),

    setAppointmentError: action((state, error) => {
        state.appointmentErr = error;
    }),

}
export default patientModel;