import { Router } from "express";

import {getSubscribers, deleteSubscriber, exportToCSV, addSubscriber } from "../controllers/subscribers.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const subscriberRouter = Router()

subscriberRouter.get("/:pageId", authorize, getSubscribers)
// subscriberRouter.get("/:id", getSubscriber)
subscriberRouter.delete("/:id/delete", authorize, deleteSubscriber)
subscriberRouter.post("/export", authorize, exportToCSV)
subscriberRouter.post("/:pageId", addSubscriber)

export default subscriberRouter