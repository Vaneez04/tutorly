import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String },
  image: { type: String },  
  timestamp: { type: Date, default: Date.now }
})

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema)
export default messageModel