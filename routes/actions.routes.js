import { adminAuthorize } from "../middlewares/auth.middleware.js";
import { getAllPages, getAllSubscribers, getAllTemplates, getAllUsers } from "../controllers/actions.controller.js";

import { Router } from "express";

const actionRouter = Router()

actionRouter.get("/pages", getAllPages)

actionRouter.get("/users", getAllUsers)

actionRouter.get("/templates", getAllTemplates)

actionRouter.get("/subscribers", getAllSubscribers)

export default actionRouter