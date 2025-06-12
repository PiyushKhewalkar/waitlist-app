import { Router } from "express";

import { getPage, getPages, createPage, deletePage, publishPage, captureView } from "../controllers/page.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import { checkLimit } from "../middlewares/checkLimit.middlewear.js";

const pageRouter = Router()

pageRouter.get("/", authorize, getPages)

pageRouter.get("/:id", authorize, getPage)

pageRouter.post("/create", authorize, checkLimit("totalPages"), createPage)

pageRouter.post("/publish/:id", authorize, publishPage)

// pageRouter.put("/:id/update", )

pageRouter.delete("/:id/delete", authorize, deletePage)

pageRouter.get("/capture/:id", captureView)

export default pageRouter