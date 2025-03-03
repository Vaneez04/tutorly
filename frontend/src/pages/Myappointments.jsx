import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Myappointments = () => {
  const { backendUrl,token } = useContext(AppContext)
  const navigate=useNavigate();
  const [myappointments, setMyAppointments] = useState([])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]; // Subtract 1
  }
  

     // Getting User's all  Appointments Data Using API
     const getUserAppointments = async () => {
      try {

          const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
          setMyAppointments(data.appointments.reverse())

      } catch (error) {
          console.log(error)
          toast.error(error.message)
      }
  }
  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

        if (data.success) {
            toast.success(data.message)
            getUserAppointments()   // ise yaha call kiya hai taki cancel hone ke baad wo wala slot bina reload liye show ho
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }

}


  useEffect(() => {
    if (token) {
        getUserAppointments()
    }
}, [token])

  return (
    <div className="p-4">
      <p className="text-2xl font-bold mb-4">My Appointments</p>
      <div className="space-y-4">
        {myappointments.map((item, index) => (
          <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
            {/* Image Section */}
            <div className="w-24 h-24">
              <img src={item.tData.image} alt="Tutor" className="w-full h-full object-cover rounded-md" />
            </div>

            {/* Info Section */}
            <div className="flex-1 ml-4">
              <p  className="text-lg font-semibold">{item.tData.name}</p>
              <p className="text-sm text-gray-600">{item.tData.speciality}</p>
              <p className="text-sm">Experience: {item.tData.experience}</p>
              <p className="text-sm">Degree: {item.tData.degree}</p>
              <p className="text-sm">
                <span className="font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}
              </p>
            </div>

            {/* Button Section */}
            <div className="flex flex-col space-y-2">
          {!item.cancelled && !item.isCompleted && <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">
                Pay Online
              </button>}
              {!item.cancelled &&  !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                Cancel
              </button>}
              {item.cancelled && !item.isCompleted && <button className="px-4 py-2 bg-gray-500 text-white rounded-md">Appointment cancelled</button>}
              {item.isCompleted && <button className="px-4 py-2 bg-green-500 text-white rounded-md"> Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Myappointments
