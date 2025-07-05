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
  <div className="m-4 sm:m-6 md:m-8">
  {/* Summary Cards */}
  <div className="flex flex-wrap gap-4 justify-start">
    <div className="flex items-center gap-3 bg-white p-4 w-full sm:w-auto min-w-[200px] rounded border border-gray-100 cursor-pointer hover:scale-105 transition">
      <img className="w-12 sm:w-14" src={assets.earning_icon} alt="" />
      <div>
        <p className="text-lg sm:text-xl font-semibold text-gray-600">
          {currencySymbol} {dashData.earnings}
        </p>
        <p className="text-gray-400 text-sm">Earnings</p>
      </div>
    </div>

    <div className="flex items-center gap-3 bg-white p-4 w-full sm:w-auto min-w-[200px] rounded border border-gray-100 cursor-pointer hover:scale-105 transition">
      <div>
        <p className="text-lg sm:text-xl font-semibold text-gray-600">
          {dashData.appointments}
        </p>
        <p className="text-gray-400 text-sm">Appointments</p>
      </div>
    </div>

    <div className="flex items-center gap-3 bg-white p-4 w-full sm:w-auto min-w-[200px] rounded border border-gray-100 cursor-pointer hover:scale-105 transition">
      <div>
        <p className="text-lg sm:text-xl font-semibold text-gray-600">
          {dashData.users}
        </p>
        <p className="text-gray-400 text-sm">Users</p>
      </div>
    </div>
  </div>

  {/* Latest Bookings Section */}
  <div className="bg-white mt-10">
    <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
      <p className="font-semibold text-base sm:text-lg">Latest Bookings</p>
    </div>

    <div className="pt-2 border border-t-0">
      {dashData.latestAppointments.slice(0, 5).map((item, index) => (
        <div
          className="flex flex-col px-4 sm:px-6 py-4 gap-3 hover:bg-gray-100"
          key={index}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 flex-1">
              <img
                className="rounded-full w-10 h-10 object-cover"
                src={item.userData.image}
                alt=""
              />
              <div className="text-sm">
                <p className="text-gray-800 font-medium">{item.userData.name}</p>
                <p className="text-gray-600">
                  Booking on {slotDateFormat(item.slotDate)}
                </p>
              </div>
            </div>

            <div className="sm:ml-auto">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-6 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-6 cursor-pointer"
                    src={assets.tick_icon}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>

          {/* ChatRoom and VideoCall */}
          {!item.cancelled && item.payment && !item.isCompleted && (
            <>
              <ChatRoom
                roomId={item._id}
                senderId={item.tutid}
                senderRole="Tutor"
                collapsible={true}
              />

              <button
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => setShowCallFor(item._id)}
              >
                Join Call
              </button>

              {showCallFor === item._id && (
                <VideoCall
                  roomId={item._id}
                  onClose={() => setShowCallFor(null)}
                />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  </div>
</div>



  )
}

export default TutorAppointments
