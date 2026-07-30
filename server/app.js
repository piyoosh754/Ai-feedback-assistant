import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"

const app=express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.json({
        message: "server is running"

    })
})

app.use("/api/auth", authRoutes)
app.use("/api/feedback", feedbackRoutes)



export default app