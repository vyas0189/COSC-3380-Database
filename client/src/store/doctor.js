import axios from "axios";
import { action, thunk } from "easy-peasy";
import { toast } from 'react-toastify';

const doctorModel = {
    appointmentLoading: false,
    appointments: [],
    appointmentErr: null,

    
}