import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext=createContext()
 
const AppContextProvider=(props)=>{

    // const value={tutors,currencySymbol}   pehle assets se tutors data la rhe the
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
        // const backendUrl = 'http://localhost:4000'
    const [tutors, setTutors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')   // userlogin token
    const [userData, setUserData] = useState(false)  // user ki profile ko get/update ke liye hai

     // Getting All Tutors using API
     const getTutorsData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/tutor/list')
            if (data.success) {
                setTutors(data.tutors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }
    useEffect(() => {
        getTutorsData()
    }, [])

      // Getting User Profile using API
      const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
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
            loadUserProfileData()
        }
    }, [token])

    const value = {
        tutors,getTutorsData,
        currencySymbol,
        backendUrl,
        token,setToken,
        userData,setUserData,
        loadUserProfileData
    }

    return(
       <AppContext.Provider value={value}>
       {props.children}
       </AppContext.Provider>
    )
}
export default AppContextProvider