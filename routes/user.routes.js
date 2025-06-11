import { getUser, getUsers, deleteUser, getSelf } from "../controllers/user.controller.js";
import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.get("/self", authorize, getSelf)  // More specific route first
userRouter.get("/", getUsers)     // Then the root route
userRouter.get("/:id", getUser)   // Then the parameterized route
userRouter.delete("/:id", deleteUser)

export default userRouter