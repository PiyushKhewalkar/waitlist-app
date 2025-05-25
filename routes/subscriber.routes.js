import { Router } from "express";

import {getSubscribers, deleteSubscriber, exportToCSV } from "../controllers/subscribers.controller.js";

const subscriberRouter = Router()

subscriberRouter.get("/:pageId", getSubscribers)
// subscriberRouter.get("/:id", getSubscriber)
subscriberRouter.delete("/:id/delete", deleteSubscriber)
subscriberRouter.post("/export", exportToCSV)

export default subscriberRouter