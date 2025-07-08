import React, { useContext } from 'react'
import { AdminContext } from './context/AdminContext';
import { TutorContext } from './context/TutorContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import AllAppointments from './pages/Admin/AllAppointments';
import AddTutor from './pages/Admin/AddTutor';
import TutorsList from './pages/Admin/TutorsList';
import TutorDashboard from './pages/Tutors/TutorDashboard';
import TutorAppointments from './pages/Tutors/TutorAppointments';
import TutorProfile from './pages/Tutors/TutorProfile';
import ChatPage from './pages/Tutors/ChatPage';
const App = () => {
  const { aToken } = useContext(AdminContext)
  const { tToken } = useContext(TutorContext)
  return aToken || tToken ? (
    <div >
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
{/* ADMIN ROUTES */}
          <Route path='/' element={<></>} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-tutor' element={<AddTutor />} />
          <Route path='/tutor-list' element={<TutorsList />} />
          {/* TUTOR ROUTES */}
          <Route path='/tutor-dashboard' element={<TutorDashboard />} />
          <Route path='/tutor-appointments' element={<TutorAppointments />} />
          <Route path='/tutor-profile' element={<TutorProfile />} />
          <Route path='/chat/:appointmentId' element={<ChatPage />} />
        </Routes>

      </div>
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  )


}

export default App
