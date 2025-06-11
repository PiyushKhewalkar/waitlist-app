import Page from "../models/page.model.js";
import Template from "../models/template.model.js";
import User from "../models/user.model.js";
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
    const pages = await Page.find({ userId: req.user._id });

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

    const page = await Page.findOne({ _id: id, userId: req.user._id });
    if (!page) return res.status(404).json({ message: "Page not found" });

    return res.status(200).json({ page });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const createPage = async (req, res) => {
  try {
    const { name, userPrompt } = req.body;
    console.log("[INPUT] name:", name);
    console.log("[INPUT] userPrompt:", userPrompt);

    if (!name || !userPrompt) {
      console.log("[ERROR] Missing inputs");
      return res.status(400).json({ message: "Please enter valid inputs" });
    }

    let page = new Page({
      name,
      userId: req.user._id,
    })

    await page.save()

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
    const code = ejs.render(template.templateCode, {
      ...validatedCopy,
      pageId: page._id.toString(), // <--- inject this into the rendered HTML
    });
    
    console.log("[RESULT] Page code rendered: ", code);

    console.log("[STEP] Saving page to database...");
    
    page.pageCode = code

    await page.save();

    const user = await User.findById(req.user._id)

    if (!user) return res.status(404).json({message: "User not found"})

    user.usage.totalPages++

    user.save()
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

    const deletedPage = await Page.findOneAndDelete({ _id: id, userId: req.user._id });

if (!deletedPage) return res.status(404).json({ message: "Page not found or not yours" });

    return res
      .status(201)
      .json({ message: "page deleted succesfully", deletedPage });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const publishPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { pathName } = req.body;

    // 1. Find the page
    const page = await Page.findById(id);
    if (!page) return res.status(404).json({ message: "Page not found" });

    // 2. Check if path is already taken
    const existingPath = await Page.findOne({ pathName });
    if (existingPath)
      return res.status(400).json({ message: "This path is already taken" });

    // 3. Assign and save
    page.pathName = pathName;
    page.pageLink = `https://waitlist.hypelister.com/public/${pathName}`;
    await page.save();

    // 4. Return confirmation
    return res.status(200).json({
      message: "Page published successfully",
      pathName: page.pathName,
      pageLink: page.pageLink,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};



export const updatePage = async(req, res) => {
  try {

    const {id} = req.params
    const {heading} = req.body


    
  } catch (error) {
    
  }
}