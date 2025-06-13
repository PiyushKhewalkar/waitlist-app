import { Router } from "express";

import { register, login, logout, verifyEmail, resendEmailVerification, resetPassword, sendResetOtp } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", register)

authRouter.post("/login", login)

authRouter.get("/logout", logout)

authRouter.get("/verify/:token", verifyEmail)

authRouter.post("/resendemailverification", resendEmailVerification)

authRouter.post("/sendresetotp", sendResetOtp)

authRouter.post("/resetpassword", resetPassword)

export default authRouter