import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const TutorContext = createContext()

const TutorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [tToken, setTToken] = useState(localStorage.getItem('tToken') ? localStorage.getItem('tToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)

 // Getting Tutor appointment data from Database using API
 const getAppointments = async () => {
    try {

        const { data } = await axios.get(backendUrl + '/api/tutor/appointments', { headers: { tToken } })

        if (data.success) {
            setAppointments(data.appointments.reverse())
           
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

// Function to Mark appointment completed using API
const completeAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(backendUrl + '/api/tutor/complete-appointment', { appointmentId }, { headers: { tToken } })

        if (data.success) {
            toast.success(data.message)
            getAppointments()
           
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
        console.log(error)
    }
}

// Function to cancel tutor appointment using API
const cancelAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(backendUrl + '/api/tutor/cancel-appointment', { appointmentId }, { headers: { tToken } })

        if (data.success) {
            toast.success(data.message)
            getAppointments()
          
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
        console.log(error)
    }
}


    // Getting Tutor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/tutor/dashboard', { headers: { tToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }
    const value = {
        backendUrl,
        tToken,setTToken,
        appointments, getAppointments,setAppointments,
        completeAppointment,cancelAppointment,
        dashData,getDashData,setDashData
    }
    return (
        <TutorContext.Provider value={value}>
            {props.children}
        </TutorContext.Provider>
    )


}

export default TutorContextProvider