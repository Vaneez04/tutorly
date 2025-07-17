import React, { useContext, useEffect, useState } from 'react'
import { TutorContext } from '../../context/TutorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import ChatRoom from '../../components/ChatRoom'
import VideoCall from '../../components/VideoCall'
import { useNavigate } from 'react-router-dom'

const TutorDashboard = () => {
  const navigate = useNavigate()
  const { tToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(TutorContext)
  const { slotDateFormat, currencySymbol } = useContext(AppContext)

  const [showCallId, setShowCallId] = useState(null)

  useEffect(() => {
    if (tToken) {
      getDashData()
    }
  }, [tToken])

  return dashData && (
    <div className='m-5'>

      {/* Summary Cards */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currencySymbol} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
            <p className='text-gray-400'>Users</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 10).map((item, index) => (
            <div className='flex flex-col px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <div className="flex items-center">
                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm ml-3'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>Booking on {slotDateFormat(item.slotDate)}</p>
                </div>

                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <div className='flex gap-1'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-6 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-6 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
                )}
              </div>

              {/* ChatRoom rendered only for active & paid appointments */}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button
                  onClick={() => navigate(`/chat/${item._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  RESPOND IN CHAT
                </button>
              )}

              {/* Video Call button */}
              {item.payment && !item.isCompleted && !item.cancelled && (
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowCallId(item._id)}
                >
                  Join Call
                </button>
              )}

              {showCallId === item._id && (
                <VideoCall
                  roomId={item._id}
                  onClose={() => setShowCallId(null)}
                  isInitiator={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TutorDashboard
