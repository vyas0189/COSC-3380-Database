import axios from 'axios';
import { action, thunk } from "easy-peasy";
import { toast } from 'react-toastify';
import setAuthToken from '../utils/setAuthToken';

export const patientModel = {
    userLoading: false,
    appointments: [],
    
}