import express from "express"

import { PORT } from "./config/env.js"

import connectToDatabase from "./database/mongodb.js"

import cors from "cors"

import cookieParser from "cookie-parser"

//router
import templateRouter from "./routes/template.routes.js"
import pageRouter from "./routes/page.routes.js"
import authRouter from "./routes/auth.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use("/api/page", pageRouter)
app.use("/api/template", templateRouter)
app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
    res.send("Home")
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

app.listen(PORT, async() => {
    console.log(`Your server is listening at http://localhost:${PORT}`)
    await connectToDatabase()
})