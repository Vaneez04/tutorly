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
import jwt from "jsonwebtoken"     

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/tutor', tutorRouter)
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)

app.get('/', (req, res) => {
  res.send("api fetching")
})

// Setup HTTP Server + Socket.IO
const server = http.createServer(app)
//This is needed because Socket.IO needs access to the raw HTTP server to upgrade HTTP to WebSocket under the hood.
const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || ["*"];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // If no origin (like from Postman), or origin is allowed, accept it
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"]
  },
  pingTimeout: 20000,
  pingInterval: 25000
});


//  JWT AUTH MIDDLEWARE FOR SOCKET.IO ,  ensures every socket is authenticated before proceeding.
io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error("No token"))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id
    socket.userRole = decoded.role || 'User'  // optional
    next()
  } catch (err) {
    next(new Error("Invalid token"))
  }
})

io.on('connection', (socket) => {  //fired after the above middleware succeeds. You now have a valid socket with:socket.id: a unique connection ID socket.userId: pulled from JWT
  console.log(` New socket connected: ${socket.id}, UserID: ${socket.userId}`)

  // Join a specific room (appointment ID)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId)
    console.log(` Socket ${socket.id} joined room: ${roomId}`)
  })

  //  Handle incoming messages — no senderId from client now, server receiving messages from client(user/tutor)
  socket.on('sendMessage', async ({ roomId, message, image }) => {
    try {
      const savedMsg = await MessageModel.create({
        appointmentId: roomId,
        senderId: socket.userId,             //  from JWT
        senderRole: socket.userRole || "",   // optional
        message: message || "",
        image: image || "",
        timestamp: new Date()
      })

      console.log(" Message saved & emitting:", savedMsg)
      
// After saving the message, it is broadcasted to all clients in the same roomId (including sender).
      io.to(roomId).emit('receiveMessage', {
        _id: savedMsg._id,
        message: savedMsg.message,
        image: savedMsg.image,
        senderId: savedMsg.senderId,
        appointmentId: savedMsg.appointmentId,
        timestamp: savedMsg.timestamp
      })
    } catch (err) {
      console.error(" Error saving message:", err.message)
    }
  })


  // WebRTC: Video Call Signaling
  socket.on('joinCallRoom', (roomId) => {
    socket.join(roomId)
    console.log(`📹 Socket ${socket.id} joined video call room: ${roomId}`)
  })

  socket.on('offer', (payload) => {
    socket.to(payload.roomId).emit('offer', payload)
  })

  socket.on('answer', (payload) => {
    socket.to(payload.roomId).emit('answer', payload)
  })

  socket.on('ice-candidate', (payload) => {
    socket.to(payload.roomId).emit('ice-candidate', payload)
  })

  socket.on('disconnect', () => {
    console.log(` Socket disconnected: ${socket.id}`)
  })
})

server.listen(port, () => console.log(` Server started at PORT ${port}`))
