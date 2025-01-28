import React from 'react'
import { useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { TutorContext } from '../context/TutorContext'
const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const {tToken, setTToken}=useContext(TutorContext)
    const navigate=useNavigate()
    const logout=()=>{
        navigate('/')
        tToken && setTToken('')
        tToken && localStorage.removeItem('tToken')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
    }
    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 shadow-md">
          <div>
            <h4 className="text-lg font-bold text-gray-800">TUTORLY</h4>
            <p className="text-sm text-gray-600">{aToken ? "Admin" : "Tutor"}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition">
            Logout
          </button>
        </div>
      );
      
}

export default Navbar
