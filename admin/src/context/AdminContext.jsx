import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [tutors, setTutors] = useState([])  // yeh state saare tutors ki list ke lye hai
    
    const [appointments, setAppointments] = useState([])

      // Getting all tutors data from Database using API
      const getAllTutors = async () => {

        try {
                console.log(backendUrl)
            const { data } = await axios.get(backendUrl + '/api/admin/all-tutors', { headers: { aToken } })
            if (data.success) {
                setTutors(data.tutors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    //  // Function to change tutor availablity using API
    //  const changeAvailability = async (tId) => {
    //     try {

    //         const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { tId }, { headers: { aToken } })
    //         if (data.success) {
    //             toast.success(data.message)
    //             getAllTutors()
    //         } else {
    //             toast.error(data.message)
    //         }

    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.message)
    //     }
    // }

     // Getting all appointment data from Database using API
     const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())   // recent wale pehle
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

     // Function to cancel appointment using API
     const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()   // taki ab wo slot empty hojae aur dusre ko mil sake
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }


    const value = {
        aToken, setAToken,
        tutors,
        getAllTutors,
        appointments,
        getAllAppointments,cancelAppointment
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider