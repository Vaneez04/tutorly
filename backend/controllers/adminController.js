import tutorModel from "../models/tutorModel.js"
import bcrypt from 'bcrypt'
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
// API FOR ADMIN LOGIN
const loginAdmin=async (req,res)=>{
    try {
        const {email,password}=req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for adding tutors
const addTutors=async (req,res)=>{

    try{
      
        const { name,email,password,speciality,degree,experience,about,fees,address }=req.body
         const imageFile=req.file
         // checking for all data to add doctor
          if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
             return res.json({ success: false, message: "Missing Details" })
         }
          // validating email format
          if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        //    // validating strong password
           if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
          
      
    //   this is just for help in debugging
      const requiredFields = ["name", "email", "password", "speciality", "degree", "experience", "about", "fees", "address"];
for (const field of requiredFields) {
  if (!req.body[field]) {
    return res.json({ success: false, message: `Missing field: ${field}` });
  }
}

        // hashing the password of tutor
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

         // upload image to cloudinary
         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
         const imageUrl = imageUpload.secure_url

         
        const tutorData = {
            name,
            email,
             image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
         
            experience,
            about,
            fees,
            address ,
            date: Date.now()
        }
        const newTutor = new tutorModel(tutorData)
        await newTutor.save()
        res.json({ success: true, message: 'Doctor Added' })
    }
    catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel  (yeh saari api postman me check kar skte ho) (yeh kaam backend me kar rhi admin wale mai bhi hum inhe hi use kar rhe)
const allTutors = async (req, res) => {
    try {

        const tutors = await tutorModel.find({}).select('-password')
        res.json({ success: true, tutors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}



export {loginAdmin,addTutors,allTutors,appointmentsAdmin,appointmentCancel}

