import { getUser, getUsers, deleteUser, getSelf } from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/self", getSelf)  // More specific route first
userRouter.get("/", getUsers)     // Then the root route
userRouter.get("/:id", getUser)   // Then the parameterized route
userRouter.delete("/:id", deleteUser)

export default userRouter