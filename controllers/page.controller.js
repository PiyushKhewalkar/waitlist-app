import Page from "../models/page.model.js";
import Template from "../models/template.model.js";
import ejs from "ejs";
import { z } from "zod";

//utils
import {
  generateCopy,
  getUserRequirement,
  choosePageTemplate,
} from "../utils/ai.js";

export const getPages = async (req, res) => {
  try {
    const pages = await Page.find();

    return res.status(200).json({ pages });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getPage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await Page.findById(id);

    if (!page) return res.status(404).json({ message: "page not found" });

    return res.status(200).json({ page });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// export const createPage = async (req, res) => {
//   try {

//     const {name, userPrompt} = req.body

//     if (!name || !userPrompt) return res.status(500).json({message: "Please enter valid inputs"})

//     const userRequirement = await getUserRequirement(userPrompt) // an ai service that returns structured user Requirement

//     const templates = await Template.find()

//     const templateEnum = templates.map((template) => {
//       return {
//         name: template.name,
//         description: template.description,
//         templateNumber: template.templateNumber
//       }
//     } )

//     const chosenTemplate = await choosePageTemplate(userRequirement, templateEnum) // an ai service

//     const templateNumber = chosenTemplate.templateNumber

//     if (!templateNumber) {
//       return res.status(500).json({ message: "AI failed to choose a valid template" });
//     }

//     const template = await Template.findOne({ templateNumber });

//     const responseFormat = eval(template.responseFormat);

//     const copy = await generateCopy(responseFormat) // an ai service

//     const validatedCopy = schema.parse(copy);

//     if (!validatedCopy) return res.status(500).json({message: "Copy format is not valid"})

//     const code = ejs.render(template.code, validatedCopy)

//     const page = new Page({
//         name,
//         pageCode: code
//     })

//     return res.status(201).json({message: "Page created succesfully", page})

//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error", details : error.message });
//   }
// };

export const createPage = async (req, res) => {
  try {
    const { name, userPrompt } = req.body;
    console.log("[INPUT] name:", name);
    console.log("[INPUT] userPrompt:", userPrompt);

    if (!name || !userPrompt) {
      console.log("[ERROR] Missing inputs");
      return res.status(400).json({ message: "Please enter valid inputs" });
    }

    console.log("[STEP] Getting user requirement from AI...");
    const userRequirement = await getUserRequirement(userPrompt);
    console.log("[RESULT] User requirement:", userRequirement);

    console.log("[STEP] Fetching templates from DB...");
    const templates = await Template.find();
    console.log("[RESULT] Templates found:", templates.length);

    const templateChoices = templates.map((t) => ({
      name: t.name,
      description: t.description,
      templateNumber: t.templateNumber,
    }));
    console.log("[STEP] Template choices created:", templateChoices);

    console.log("[STEP] Choosing the best template...");
    const chosenTemplate = await choosePageTemplate(
      userRequirement,
      templateChoices
    );
    console.log("[RESULT] Chosen template:", chosenTemplate);

    const templateNumber = chosenTemplate.chosenTemplate.templateNumber;
    console.log("[STEP] Fetching chosen template details...");
    const template = await Template.findOne({ templateNumber });
    if (!template) {
      console.log("[ERROR] Template not found for number:", templateNumber);
      return res.status(404).json({ message: "Template not found" });
    }
    console.log("[RESULT] Template found:", template.name);

    console.log("[STEP] Getting schema for template...");
    const schema = eval(template.responseFormat);
    if (!schema) {
      console.log(
        "[ERROR] Schema not found for template number:",
        template.templateNumber
      );
      return res.status(500).json({ message: "Schema for template not found" });
    }

    console.log("[STEP] Generating copy using AI...");
    const copy = await generateCopy(schema, userRequirement);
    console.log("[RESULT] Copy generated:", copy);

    console.log("[STEP] Validating copy against schema...");
    const validatedCopy = schema.parse(copy);
    console.log("[RESULT] Copy validated");

    console.log("[STEP] Rendering EJS template...");
    const code = ejs.render(template.templateCode, validatedCopy);
    console.log("[RESULT] Page code rendered: ", code);

    console.log("[STEP] Saving page to database...");
    const page = new Page({
      name,
      pageCode: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body>${code}</body></html>`,
    });

    await page.save();
    console.log("[RESULT] Page saved successfully");

    return res.status(201).json({ message: "Page created successfully", page });
  } catch (error) {
    console.error("[ERROR] Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPage = await Page.findByIdAndDelete(id);

    return res
      .status(201)
      .json({ message: "page deleted succesfully", deletedPage });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
