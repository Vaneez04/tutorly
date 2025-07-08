import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import tutorRouter from "./routes/tutorRoute.js"
import userRouter from "./routes/userRoute.js"
import http from "http"
import { Server } from "socket.io"
import MessageModel from "./models/messageModel.js"

import chatRouter from "./routes/chatRoute.js"

// app config
const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/tutor',tutorRouter)
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)

app.get('/',(req,res)=>{
    res.send("api fetching")
})

// Setup HTTP Server + Socket.IO
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log(' New socket connected:', socket.id)

  // Join a specific room (appointment ID)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId)
    console.log(` Socket ${socket.id} joined room: ${roomId}`)
  })

  // Handle incoming messages
socket.on('sendMessage', async ({ roomId, message, senderId, image }) => {
  try {
    const savedMsg = await MessageModel.create({
      appointmentId: roomId,
      senderId,
      message: message || "",   // default to empty string if not provided
      image: image || "",       // ✅ handle optional image
      timestamp: new Date()
    })

    // Broadcast the full saved message
    console.log("sending msg to client:", {
  message: savedMsg.message,
  image: savedMsg.image,
  senderId: savedMsg.senderId
})
    io.to(roomId).emit('receiveMessage', {
  _id: savedMsg._id,
  message: savedMsg.message,
  image: savedMsg.image,
  senderId: savedMsg.senderId,
  appointmentId: savedMsg.appointmentId,
  timestamp: savedMsg.timestamp
})
  } catch (err) {
    console.error("Error saving message:", err.message)
  }
})


 //  WebRTC: Video Call Signaling
  socket.on('joinCallRoom', (roomId) => {
    socket.join(roomId);
    console.log(` Socket ${socket.id} joined video call room: ${roomId}`);
  });

  socket.on('offer', (payload) => {
    socket.to(payload.roomId).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    socket.to(payload.roomId).emit('answer', payload);
  });

  socket.on('ice-candidate', (payload) => {
    socket.to(payload.roomId).emit('ice-candidate', payload);
  });


 
  socket.on('disconnect', () => {
    console.log(' Socket disconnected:', socket.id)
  })
})
server.listen(port,()=> console.log(`server started at PORT ${port}`))
