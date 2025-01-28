import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // yeh frontend me req h
    tutid: { type: String, required: true },          // yeh frontend me req h
    slotDate: { type: String, required: true },         // yeh frontend me req h
    slotTime: { type: String, required: true },         // yeh frontend me req h
    userData: { type: Object, required: true },
    tData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel