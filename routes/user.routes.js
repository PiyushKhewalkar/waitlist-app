import { getUser, getUsers, deleteUser, getSelf } from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/", getUsers)

userRouter.get("/:id", getUser)

userRouter.get("/self", getSelf)

userRouter.delete("/:id", deleteUser)

export default userRouter