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

const allowedOrigins = ["http://localhost:5173"]

app.use(cors({origin: allowedOrigins, credentials: true}))

app.use("/api/page", pageRouter)
app.use("/api/template", templateRouter)
app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
    res.send("Home")
})

app.listen(PORT, async() => {
    console.log(`Your server is listening at http://localhost:${PORT}`)
    await connectToDatabase()
})