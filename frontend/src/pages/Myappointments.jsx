import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ChatRoom from '../components/ChatRoom'
import VideoCall from '../components/VideoCall' // ✅ Ensure this is created and imported

const Myappointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [myappointments, setMyAppointments] = useState([])
  const [showCallId, setShowCallId] = useState(null)

  const [activeCallAppointmentId, setActiveCallAppointmentId] = useState(null) // ✅ manages which call to show

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      setMyAppointments(data.appointments.reverse())
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,  // RAZORPAY order ID
      receipt: order.receipt,  //apointment ID
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + "/api/user/verify-Razorpay", response, { headers: { token } });
          if (data.success) {
            navigate('/appointments')
            getUserAppointments()
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      // is request se bad order milta hai
      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className="p-4 sm:p-6">
  <p className="text-2xl font-bold mb-4 text-center sm:text-left">My Appointments</p>
  
  <div className="space-y-4">
    {myappointments.map((item, index) => (
      <div
        key={index}
        className="flex flex-col bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4 sm:space-y-0"
      >
        {/* Top Section: Tutor Info + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Tutor Info */}
          <div className="flex gap-4 items-start sm:items-center">
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item.tData.image}
                alt="Tutor"
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <div className="flex-1">
              <p className="text-lg font-semibold">{item.tData.name}</p>
              <p className="text-sm text-gray-600">{item.tData.speciality}</p>
              <p className="text-sm">Experience: {item.tData.experience}</p>
              <p className="text-sm">Degree: {item.tData.degree}</p>
              <p className="text-sm">
                <span className="font-medium">Date & Time:</span>{' '}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            {!item.cancelled && item.payment && (
              <button className="w-full sm:min-w-[120px] py-2 px-3 border rounded hover:bg-primary hover:text-white transition">
                Paid
              </button>
            )}

            {!item.cancelled && !item.payment && !item.isCompleted && (
              <button
                onClick={() => appointmentRazorpay(item._id)}
                className="w-full sm:min-w-[120px] px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
              >
                Pay Online
              </button>
            )}

            {!item.cancelled && !item.isCompleted && (
              <button
                onClick={() => cancelAppointment(item._id)}
                className="w-full sm:min-w-[120px] px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>
            )}

            {item.cancelled && !item.isCompleted && (
              <button className="w-full sm:min-w-[120px] px-4 py-2 bg-gray-500 text-white rounded-md">
                Appointment cancelled
              </button>
            )}

            {item.isCompleted && (
              <button className="w-full sm:min-w-[120px] px-4 py-2 bg-green-500 text-white rounded-md">
                Completed
              </button>
            )}
          </div>
        </div>

        {/* ChatRoom */}
       {!item.cancelled && item.payment && !item.isCompleted && (
  <div>
    <button
      onClick={() => navigate(`/chat/${item._id}`)}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      ASK IN CHAT
    </button>
  </div>
)}


        {/* Start Call */}
    {item.payment && !item.isCompleted && !item.cancelled && (
  <button
    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
    onClick={() => setShowCallId(item._id)}
  >
    Start Call
  </button>
)}

{showCallId === item._id && (
  <VideoCall
    roomId={item._id}
    onClose={() => setShowCallId(null)}
    isInitiator={true} // ✅ User starts the call
  />
)}


      </div>
    ))}
  </div>
</div>

  )
}

export default Myappointments
