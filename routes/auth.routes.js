import { Router } from "express";

import { register, login, logout } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/register", register)

authRouter.post("/login", login)

authRouter.get("/logout", logout)

export default authRouter