import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { TutorContext } from '../context/TutorContext'
import { toast } from 'react-toastify'
const Login = () => {

    const [state, setState] = useState('Admin')
  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { setAToken } = useContext(AdminContext)
    const { setTToken } = useContext(TutorContext)

    // ON SUBMITTING FORM 
    const onSubmitHandler = async (event) => {
        event.preventDefault();
    
        if (state === 'Admin') {
    
          const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
          if (data.success) {
            setAToken(data.token)
            localStorage.setItem('aToken', data.token)
          } else {
            toast.error(data.message)
          }
    
        }
       else {
  const { data } = await axios.post(backendUrl + '/api/tutor/login', { email, password })
  if (data.success) {
    setTToken(data.token)
    localStorage.setItem('tToken', data.token)

    
  } else {
    toast.error(data.message)
  }
}

    }

    return (
        <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col gap-4 p-6 max-w-sm w-full bg-white border rounded-lg shadow-md">
          <p className="text-xl font-bold text-center text-gray-800">{state} Login</p>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none text-sm" type="email" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none text-sm" type="password" required />
          </div>
          <button className="w-full py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition">Login</button>
          <p className="text-sm text-center text-gray-600">
            {state === "Admin" ? (
              <>Tutor Login? <span onClick={() => setState("Tutor")} className="text-black underline cursor-pointer hover:text-gray-800">Click here</span></>
            ) : (
              <>Admin Login? <span onClick={() => setState("Admin")} className="text-black underline cursor-pointer hover:text-gray-800">Click here</span></>
            )}
          </p>
        </div>
      </form>
    )
}
    export default Login