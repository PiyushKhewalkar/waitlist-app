import { Router } from "express";

import { getPage, getPages, createPage, deletePage } from "../controllers/page.controller.js";

const pageRouter = Router()

pageRouter.get("/", getPages)

pageRouter.get("/:id", getPage)

pageRouter.post("/create", createPage)

// pageRouter.put("/:id/update", )

pageRouter.delete("/:id/delete", deletePage)

export default pageRouter

// get all pages

// get a page

// create a page - generate

// update a page - iterate

// publish a page - connect to domain

// delete a page