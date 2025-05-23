import express from "express"

import { PORT } from "./config/env.js"

import connectToDatabase from "./database/mongodb.js"

import cors from "cors"

//router
import templateRouter from "./routes/template.routes.js"
import pageRouter from "./routes/page.routes.js"

const app = express()

app.use(cors())

app.use(express.json());

app.use("/api/page", pageRouter)
app.use("/api/template", templateRouter)

app.get("/", (req, res) => {
    res.send("Home")
})

app.listen(PORT, async() => {
    console.log(`Your server is listening at http://localhost:${PORT}`)
    await connectToDatabase()
})