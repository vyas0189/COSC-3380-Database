import authModel from './auth';
import patientModel from './patient';
import adminModel from './admin';
import doctorModel from './doctor';

const model = {
    auth: authModel,
    patient: patientModel,
    admin: adminModel,
    doctor: doctorModel,
}

export default model;