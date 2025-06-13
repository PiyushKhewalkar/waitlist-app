import { Router } from "express";

import {getSubscribers, deleteSubscriber, exportToCSV, addSubscriber, updateSubscriber } from "../controllers/subscribers.controller.js";

import {authorize} from "../middlewares/auth.middleware.js";

const subscriberRouter = Router()

subscriberRouter.get("/:pageId", authorize, getSubscribers)
// subscriberRouter.get("/:id", getSubscriber)
subscriberRouter.delete("/:id", authorize, deleteSubscriber)
subscriberRouter.post("/export", authorize, exportToCSV)
subscriberRouter.post("/:pageId", addSubscriber)
subscriberRouter.put("/:id", authorize, updateSubscriber)

export default subscriberRouter