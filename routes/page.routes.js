import { Router } from "express";

import { getPage, getPages, createPage, deletePage } from "../controllers/page.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const pageRouter = Router()

pageRouter.get("/", authorize, getPages)

pageRouter.get("/:id", authorize, getPage)

pageRouter.post("/create", authorize, createPage)

// pageRouter.put("/:id/update", )

pageRouter.delete("/:id/delete", authorize, deletePage)

export default pageRouter

// get all pages

// get a page

// create a page - generate

// update a page - iterate

// publish a page - connect to domain

// delete a page