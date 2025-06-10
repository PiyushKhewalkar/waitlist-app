import { Router } from "express";

import { register, login, logout, verifyEmail } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", register)

authRouter.post("/login", login)

authRouter.get("/logout", logout)

authRouter.get("/verify/:token", verifyEmail)

export default authRouter