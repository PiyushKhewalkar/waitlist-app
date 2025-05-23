import { Router } from "express";

import { getTemplate, getTemplates, deleteTemplate, createTemplate, updateTemplate } from "../controllers/template.controller.js";

const templateRouter = Router()

templateRouter.get("/", getTemplates)

templateRouter.get("/:id", getTemplate)

templateRouter.post("/create", createTemplate)

templateRouter.put("/:id/update", updateTemplate)

templateRouter.delete("/:id/delete", deleteTemplate)

export default templateRouter