import { Router } from "express";

import { getSubscriber, getSubscribers, deleteSubscriber, exportToCSV } from "../controllers/subscribers.controller.js";

const subscriberRouter = Router()

subscriberRouter.post("/", getSubscribers)
subscriberRouter.get("/:id", getSubscriber)
subscriberRouter.delete("/:id/delete", deleteSubscriber)
subscriberRouter.post("/export", exportToCSV)

export default subscriberRouter