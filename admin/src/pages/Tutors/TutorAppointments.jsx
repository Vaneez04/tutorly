import React from 'react'
import { useContext, useEffect } from 'react'
import { TutorContext } from '../../context/TutorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
const TutorAppointments = () => {
  const { tToken, appointments, getAppointments,completeAppointment,cancelAppointment } = useContext(TutorContext)
  const { slotDateFormat, currencySymbol } = useContext(AppContext)


  useEffect(() => {
    if (tToken) {
      getAppointments()
    }
  }, [tToken])

  return (
    <div className="p-6">
      <p className="text-xl font-semibold mb-4">All Appointments</p>
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm w-full">
        {/* Table Header */}
        <div className=" grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6  bg-gray-100 text-gray-700 font-semibold p-4 text-center w-full">
          <p>#</p>
          <p>User</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {/* Table Data */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className=" grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6  items-center text-sm text-gray-800 border-t p-4 text-center w-full hover:bg-gray-50"
          >
            <p>{index + 1}</p>
            <div className="flex items-center space-x-4 justify-start">
              <img
                src={item.userData.image}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="truncate">{item.userData.name}</p>
            </div>
            <p className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
              Online
            </p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currencySymbol}
              {item.amount}
            </p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <div className='flex'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
          </div>
        ))}
      </div>
    </div>


  )
}

export default TutorAppointments
