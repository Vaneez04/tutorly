import mongoose from "mongoose";
const TutorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    },
    degree:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    fees:{
        type:Number,
        required:true
    },
   
    address:{
        type:String,
        required:true
    },
    slots_booked: { type: Object, default: {} },   // yaha hum key value pair me slotdate and slottime store karenge
    date:{
        type:Number,
        required:true
    },
    
}
)
const tutorModel=mongoose.models.tutor || mongoose.model("tutor",TutorSchema);
export default tutorModel