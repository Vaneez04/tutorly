import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary'
import tutorModel from '../models/tutorModel.js'
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'
// API TO REGISTER USER

const registerUser=async (req,res)=>{
try {
    const {name,email,password}=req.body
      // checking for all data to register user
      if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }
    // validating email format
    if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" })
    }
      // validating strong password
      if (password.length < 8) {
        return res.json({ success: false, message: "Please enter a strong password" })
    }
     // hashing user password
     const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
     const hashedPassword = await bcrypt.hash(password, salt)

     
     const userData = {
        name,
        email,
        password: hashedPassword,
    }
    const newUser = new userModel(userData)
    const user = await newUser.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    
    res.json({ success: true, token })
} 
catch (error) {
    console.log(error)
        res.json({ success: false, message: error.message })
}
}

// API TO LOGIN USER
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
       

        await userModel.findByIdAndUpdate(userId, { name, phone, address, dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {
//userid from middlewares auth.js
        const { userId, tutid, slotDate, slotTime } = req.body
        const tData = await tutorModel.findById(tutid).select("-password") 
         //Uses tutorModel to fetch the tutor document by its ID (tutid) from the database.
        let slots_booked = tData.slots_booked
        // checking for slot availablity 

        if (slots_booked[slotDate]) {   // Checks if the date (slotDate) exists as a key in the slots_booked object.
           // If it exists, it means there are already some booked slots for this date.
        //    If the slotTime is already present in the array for the given slotDate, the slot is unavailable.

            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)   // kyonki slottime alag tha isliye push
            }
        } else {  //If the slotDate doesn’t exist in slots_booked, initializes it as an empty array ([]).
           // Then adds the slotTime to this new array.
            
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete tData.slots_booked

        const appointmentData = {
            userId,
            tutid,
            userData,
            tData,
            amount: tData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)   // SAVING THIS IN DATABASE
        await newAppointment.save()

        // save new slots data in tData
        await tutorModel.findByIdAndUpdate(tutid, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get user's all appointments for frontend my-appointments page from database
const listOfAppointments = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing tutor slot 
        const { tutid, slotDate, slotTime } = appointmentData

        const tutorData = await tutorModel.findById(tutid)

        let slots_booked = tutorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await tutorModel.findByIdAndUpdate(tutid, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
    
// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })
console.log("Reached backend paymentRazorpay route");
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export{ registerUser,loginUser,getProfile,updateProfile,bookAppointment,listOfAppointments,cancelAppointment,paymentRazorpay,verifyRazorpay}