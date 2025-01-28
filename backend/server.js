import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import tutorRouter from "./routes/tutorRoute.js"
import userRouter from "./routes/userRoute.js"

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

app.get('/',(req,res)=>{
    res.send("api fetching")
})
app.listen(port,()=> console.log(`server started at PORT ${port}`))
