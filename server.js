import express from "express"

import { PORT } from "./config/env.js"

import connectToDatabase from "./database/mongodb.js"
import Page from "./models/page.model.js"

import cors from "cors"

import cookieParser from "cookie-parser"

//router
import templateRouter from "./routes/template.routes.js"
import pageRouter from "./routes/page.routes.js"
import authRouter from "./routes/auth.routes.js"
import subscriberRouter from "./routes/subscriber.routes.js"
import userRouter from "./routes/user.routes.js"
import actionRouter from "./routes/actions.routes.js"

const app = express()

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5501", "https://hypelister.com", "https://www.hypelister.com", "http://localhost:3000", "https://waitlist-app-ugpw.onrender.com", "https://waitlist.hypelister.com"]

app.use(cors({origin: allowedOrigins, credentials: true}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/page", pageRouter)
app.use("/api/template", templateRouter)
app.use("/api/auth", authRouter)
app.use("/api/subscriber", subscriberRouter)
app.use("/api/user", userRouter)
app.use("/api/action", actionRouter)

app.get("/public/:pathName", async (req, res) => {
  try {
    const page = await Page.findOne({ pathName: req.params.pathName });

    if (!page) {
      return res.status(404).send("Page not found");
    }

    res.setHeader("Content-Type", "text/html");
    res.send(page.pageCode);
  } catch (error) {
    console.error("Error serving public page:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/", (req, res) => {
    res.send("Home")
})

app.listen(PORT, async() => {
    console.log(`Your server is listening at http://localhost:${PORT}`)
    await connectToDatabase()
})