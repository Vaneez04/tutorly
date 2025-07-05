import React from 'react'
import { useContext, useEffect } from 'react'
import { TutorContext } from '../../context/TutorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const TutorAppointments = () => {

  const { tToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(TutorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (tToken) {
      getAppointments()
    }
  }, [tToken])

   return (
  <div className='w-full max-w-6xl m-5'>
    <p className='mb-3 text-lg font-semibold text-gray-800'>All Appointments</p>

    <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
      <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr] gap-3 py-3 px-6 border-b bg-gray-50 text-gray-700 font-medium'>
        <p>#</p>
        <p>User</p>
        <p>Payment</p>
        <p>Date & Time</p>
        <p>Fees</p>
        <p>Action</p>
      </div>

      {appointments.map((item, index) => (
        <div
          key={index}
          className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr] gap-3 items-center text-gray-700 py-3 px-6 border-b hover:bg-gray-50'
        >
          <p className='max-sm:hidden'>{index + 1}</p>

          <div className='flex items-center gap-2'>
            <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover' alt="" />
            <p>{item.userData.name}</p>
          </div>

          <p>
            <span className='text-xs border border-blue-500 text-blue-600 px-2 py-0.5 rounded-full'>
              Online
            </span>
          </p>

          <p>
            {slotDateFormat(item.slotDate)}, {item.slotTime}
          </p>

          <p className='font-medium'>
            {currency}{item.amount}
          </p>

          {item.cancelled ? (
            <p className='text-red-500 text-xs font-semibold'>Cancelled</p>
          ) : item.isCompleted ? (
            <p className='text-green-600 text-xs font-semibold'>Completed</p>
          ) : (
            <div className='flex gap-2'>
              <img
                onClick={() => cancelAppointment(item._id)}
                className='w-6 cursor-pointer'
                src={assets.cancel_icon}
                alt="Cancel"
              />
              <img
                onClick={() => completeAppointment(item._id)}
                className='w-6 cursor-pointer'
                src={assets.tick_icon}
                alt="Complete"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
  }
  
  export default TutorAppointments