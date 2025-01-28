import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { TutorContext } from '../context/TutorContext'
const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { tToken } = useContext(TutorContext)
    return (
        <div className="h-screen w-64 bg-gray-300 text-blue-800 flex flex-col p-4">
          {aToken && (
            <ul className="space-y-6">
              
              <NavLink to="/all-appointments" className="hover:text-blue-600">
                <p>Appointments</p>
              </NavLink>
              <NavLink to="/add-tutor" className="hover:text-blue-600">
                <p>Add Tutor</p>
              </NavLink>
              <NavLink to="/tutor-list" className="hover:text-blue-600">
                <p>Tutors List</p>
              </NavLink>
            </ul>
          )}

          {/* corresponding to tutors now */}
          {tToken && (
            <ul className="space-y-6">
              
              <NavLink to="/tutor-dashboard" className="hover:text-blue-600">
                <p>Dashboard</p>
              </NavLink>
              
              <NavLink to="/tutor-appointments" className="hover:text-blue-600">
                <p>Appointments</p>
              </NavLink>
           
              <NavLink to="/tutor-profile" className="hover:text-blue-600">
                <p>Profile</p>
              </NavLink>
            </ul>
          )}
        </div>
      );
      
      
    }

export default Sidebar
