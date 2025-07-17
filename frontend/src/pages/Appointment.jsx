// yaha se user appointment book karega tutor ke liye
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { tutid } = useParams()  //Extracts tutid (tutor ID) from the URL parameters (e.g., /appointment/:tutid).
  const { tutors, currencySymbol, backendUrl, token, getTutorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [tutInfo, settutInfo] = useState(false)
  const [tutSlots, setTutSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const [isBooking, setIsBooking] = useState(false)  //  to book only once even on multiple clicks

  const fetchtutInfo = async () => {
    const tutInfo = tutors.find((t) => t._id === tutid)  //, tutInfo is not an array but rather an object representing the matching tutor.Finds the tutor object from the tutors array based on the tutid.
    // Updates the tutInfo state with the selected tutor's details.
    settutInfo(tutInfo)
  }


  const getAvailableSlots = async () => {

    setTutSlots([])

    // getting current date
    let today = new Date()

    for (let i = 0; i < 7; i++) {

      // getting date with index to generate time slots for 7 consecutive days.
      let currentDate = new Date(today) 
      currentDate.setDate(today.getDate() + i)

      // setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours 
      //         Condition: If the loop is processing today (i = 0):
      // Ensures the first slot starts at least 1 hour from now, or at 10:00 AM, whichever is later.
      // If the current time is past 10:30 AM, it adjusts the minutes to start at the next 30-minute interval.
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {  // Slots start at 10:00 AM by default.
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = [];


      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        let day = currentDate.getDate()
        let month = currentDate.getMonth() 
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        // ensure kar rha ki jis tutor ka jo slot booked hai wo appointment booking me show nhi ho
        const isSlotAvailable =
          tutInfo.slots_booked &&
            tutInfo.slots_booked[slotDate] &&
            tutInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {

          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      //prev: Represents the current value of the tutSlots state.
      // ...prev: Expands the existing elements of the prev array into individual elements.
      // If you modify prev directly (e.g., prev.push(...)), React won't recognize the change because the state reference hasn't changed. React relies on immutability to detect updates and re-render components when necessary.
      setTutSlots(prev => ([...prev, timeSlots]))
    }
  }

  //  BOOK APPOINTMENT FN

  const bookAppointment = async () => {
 if (isBooking) return; // prevent duplicate calls
  setIsBooking(true);    // lock further requests
    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
       setIsBooking(false);  
    }

    const date = tutSlots[slotIndex][0].datetime

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    const slotDate = day + "_" + month + "_" + year

    try {

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { tutid, slotDate, slotTime }, { headers: { token } })
        if (data.success) {
      toast.success(data.message);
      getTutorsData();
      navigate('/appointments');
    } else {
      toast.error(data.message);
    }
  }
   catch (error) {
    console.log(error);
    toast.error(error.message);
  } 
  finally {
    setIsBooking(false);  // unlock button after response
  }
  }
  useEffect(() => {
    if (tutors.length > 0) {
      fetchtutInfo()
    }
  }, [tutors, tutid])

  useEffect(() => {
    if (tutInfo) {
      getAvailableSlots()
    }
  }, [tutInfo])
  return tutInfo ? (
   <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 space-y-10">
  {/* Tutor Details */}
  <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
    {/* Tutor Image */}
    <div className="sm:w-1/3 w-full max-w-xs mx-auto sm:mx-0">
      <img
        className="bg-blue-400 w-full sm:max-w-72 rounded-lg"
        src={tutInfo.image}
        alt={tutInfo.name}
      />
    </div>

    {/* Tutor Details - Single Box */}
    <div className="flex-1 border border-[#ADADAD] rounded-lg p-6 sm:p-8 bg-white relative shadow-md">
      {/* Tutor Name and Verification */}
      <div className="flex items-center gap-2 mb-2">
        <p className="text-gray-600 font-medium text-lg">
          {tutInfo.name}
        </p>
        <img className="w-5" src={assets.verified_icon} alt="Verified Icon" />
      </div>

      {/* Degree and Experience */}
      <div className="flex items-center gap-2 mb-4 text-gray-600">
        <p>
          {tutInfo.degree} - {tutInfo.speciality}
        </p>
        <button className="py-0.5 px-2 border text-xs rounded-full">
          {tutInfo.experience}
        </button>
      </div>

      {/* About Section */}
      <div className="mb-4">
        <p className="flex items-center gap-1 text-sm font-medium text-[#262626]">
          About <img className="w-3" src={assets.info_icon} alt="Info Icon" />
        </p>
        <p className="text-sm text-gray-600 max-w-[700px] mt-2">
          {tutInfo.about}
        </p>
      </div>

      {/* Fees at the bottom-left corner */}
      <p className="text-gray-600 font-medium mt-4">
        Appointment fee:{" "}
        <span className="text-gray-800">
          {currencySymbol}
          {tutInfo.fees}
        </span>
      </p>
    </div>
  </div>




      {/* Slots Booking Section */}
      <div className="border border-gray-300 rounded-lg p-4 sm:p-6 bg-white shadow text-center">
        <p className="text-xl font-medium text-gray-700 mb-6">Slots Booking</p>

        {/* Days and Dates */}
      <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto py-3 px-1">

          {tutSlots.length > 0 &&
            tutSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-3 px-4 rounded-lg cursor-pointer ${slotIndex === index
                    ? "bg-blue-400 text-black"
                    : "border border-gray-300 bg-gray-100 text-gray-600"
                  } transition-all duration-300 ease-in-out hover:scale-105`}
              >
                <p className="text-sm font-medium">
                  {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                </p>
                <p className="text-xs font-light">
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </div>
            ))}
        </div>

        {/* Time Slots */}
        <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto mt-5 px-1">

          {tutSlots.length > 0 &&
            tutSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-medium flex-shrink-0 px-4 py-2 rounded-lg cursor-pointer ${item.time === slotTime
                    ? "bg-blue-400 text-black"
                    : "border border-gray-300 text-gray-600"
                  } transition-all duration-300 ease-in-out hover:bg-gray-400`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* Button */}
       <button
  onClick={bookAppointment}
  disabled={isBooking}
  className={`w-full sm:w-auto text-sm font-semibold px-6 py-3 rounded-lg mt-6 transition duration-300
    ${isBooking ? "bg-gray-400 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500 text-black"}`}
>
  {isBooking ? "Booking..." : "Book an Appointment"}
</button>
      </div>
    </div>
  ) : null;


}

export default Appointment
