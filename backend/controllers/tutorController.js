import bcrypt from 'bcrypt'
 import tutorModel from "../models/tutorModel.js"
 import jwt from 'jsonwebtoken'
 import appointmentModel from '../models/appointmentModel.js'

// // API to change tutor availablity for Admin and tutor Panel
// const changeAvailablity = async (req, res) => {
//     try {

//         const { tId } = req.body

//         const tData = await tutorModel.findById(tId)
//         await tutorModel.findByIdAndUpdate(tId, { available: !tData.available })
//         res.json({ success: true, message: 'Availablity Changed' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
// export {
//     changeAvailablity,
// }

// API to get all tutors list for Frontend
const tutorList = async (req, res) => {
    try {

        const tutors = await tutorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, tutors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for tutor Login 
const loginTutor = async (req, res) => {

    try {

        const { email, password } = req.body
        const tutor = await tutorModel.findOne({ email })

        if (!tutor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, tutor.password)

        if (isMatch) {
  const token = jwt.sign({ id: tutor._id }, process.env.JWT_SECRET)
  res.json({ 
    success: true, 
    token, 
    
  })
}
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API TO GET TUTOR'S APPOINTMENTS (ALL APPOINTMENTS OF A PARTICULAR TUTOR ) {WILL USE tutid TO GET APPOINTMENTS}
const appointmentsOfTutor = async (req, res) => {
    try {

        const { tutid } = req.body
        const appointments = await appointmentModel.find({ tutid })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for tutor panel
const appointmentComplete = async (req, res) => {
    try {

        const { tutid, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.tutid === tutid) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment for tutor panel
const appointmentCancel = async (req, res) => {
    try {

        const { tutid, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.tutid === tutid) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for tutor panel
const tutorDashboard = async (req, res) => {
    try {

        const { tutid } = req.body

        const appointments = await appointmentModel.find({ tutid })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted ) {
                earnings += item.amount
            }
        })

        let users = []  // to get unique users

        appointments.map((item) => {
            if (!users.includes(item.userId)) {
                users.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            users: users.length,
            latestAppointments: appointments.reverse().slice(0, 10)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get tutor profile data

const tutorProfile = async (req, res) => {
    try {

        const { tutid } = req.body
        const profileData = await tutorModel.findById(tutid).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export{
    tutorList,loginTutor,appointmentsOfTutor,appointmentComplete,appointmentCancel,tutorDashboard,tutorProfile
}