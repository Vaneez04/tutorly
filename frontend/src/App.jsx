import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Tutors from './pages/Tutors'
import Login from './pages/Login'
import Myappointments from './pages/Myappointments'
import Myprofile from './pages/Myprofile'
import About from './pages/About'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatPage from './pages/ChatPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
   <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<Contact/>}/>
      <Route path='/tutors' element={<Tutors/>}/>
        <Route path='/tutors/:speciality' element={<Tutors/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        {/* user ke booked appointments */}
        <Route path='/appointments' element={<Myappointments/>}/> 
               <Route path='/profile' element={<Myprofile/>}/>
        {/* user book karega is path se */}
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/appointment/:tutid' element={<Appointment />} />
        <Route path='/chat/:appointmentId' element={<ChatPage />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
