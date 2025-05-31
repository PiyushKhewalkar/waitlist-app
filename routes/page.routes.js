import { Router } from "express";

import { getPage, getPages, createPage, deletePage } from "../controllers/page.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import { checkLimit } from "../middlewares/checkLimit.middlewear.js";

const pageRouter = Router()

pageRouter.get("/", authorize, getPages)

pageRouter.get("/:id", authorize, getPage)

pageRouter.post("/create", authorize, checkLimit("totalPages"), createPage)

// pageRouter.put("/:id/update", )

pageRouter.delete("/:id/delete", authorize, deletePage)

export default pageRouter