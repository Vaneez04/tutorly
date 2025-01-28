import express from 'express';
import { loginTutor, tutorList,appointmentsOfTutor, appointmentComplete, appointmentCancel, tutorDashboard } from '../controllers/tutorController.js';
import authTutor from '../middlewares/authTutor.js';

const tutorRouter = express.Router();

tutorRouter.get("/list",tutorList)
tutorRouter.post('/login',loginTutor)
tutorRouter.get('/appointments',authTutor,appointmentsOfTutor)
tutorRouter.post('/complete-appointment',authTutor,appointmentComplete)
tutorRouter.post('/cancel-appointment',authTutor,appointmentCancel)
tutorRouter.get('/dashboard',authTutor,tutorDashboard)
export default tutorRouter