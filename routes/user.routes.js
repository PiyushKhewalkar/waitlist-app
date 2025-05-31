import { getUser, getUsers } from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/", getUsers)

userRouter.get("/:id", getUser)

export default userRouter