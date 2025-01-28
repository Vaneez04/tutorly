import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat,currencySymbol } = useContext(AppContext)
  
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="p-4">
    <p className="text-lg font-bold mb-4">ALL APPOINTMENTS</p>
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[50px_2fr_2fr_2fr_1fr_1fr] gap-4 bg-gray-200 p-2 rounded-md">
        <p className="font-semibold">#</p>
        <p className="font-semibold">User</p>
        <p className="font-semibold">Date & Time</p>
        <p className="font-semibold">Tutor</p>
        <p className="font-semibold">Fees</p>
        <p className="font-semibold">Action</p>
      </div>
      {console.log(appointments)}
      {appointments.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-[50px_2fr_2fr_2fr_1fr_1fr] gap-4 items-center border-b border-gray-300 p-2"
        >
          <p>{index + 1}</p>
          <div className="flex items-center gap-2">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={item.userData.image}
              alt=""
            />
            <p>{item.userData.name}</p>
          </div>
          <p>
            {slotDateFormat(item.slotDate)}, {item.slotTime}
          </p>
          <div className="flex items-center gap-2">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={item.tData.image}
              alt=""
            />
            <p>{item.tData.name}</p>
          </div>
          <p>{currencySymbol}{item.amount}</p>
          {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
        </div>
      ))}
    </div>
  </div>
  
  );
  
}

export default AllAppointments
