import { getUser, getUsers, deleteUser } from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/", getUsers)

userRouter.get("/:id", getUser)

userRouter.delete("/:id", deleteUser)

export default userRouter