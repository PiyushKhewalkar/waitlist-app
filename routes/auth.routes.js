import { Router } from "express";

import { register, login, logout, verifyEmail, resendEmailVerification, resetPassword, sendResetOtp, googleLogin } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", register)

authRouter.post("/login", login)

authRouter.get("/logout", logout)

authRouter.get("/verify/:token", verifyEmail)

authRouter.post("/resendemailverification", resendEmailVerification)

authRouter.post("/sendresetotp", sendResetOtp)

authRouter.post("/resetpassword", resetPassword)

authRouter.post("/google-login", googleLogin)


export default authRouter