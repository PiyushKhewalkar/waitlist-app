import { Router } from "express";

import { register, login, logout, verifyEmail, resendEmailVerification } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", register)

authRouter.post("/login", login)

authRouter.get("/logout", logout)

authRouter.get("/verify/:token", verifyEmail)

authRouter.post("/resendemailverification", resendEmailVerification)

export default authRouter