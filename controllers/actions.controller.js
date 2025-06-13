import User from "../models/user.model.js";
import Template from "../models/template.model.js";
import Page from "../models/page.model.js";
import Subscriber from "../models/subscriber.model.js";

export const getAllPages = async(req, res) => {
    try {

        const pages = await Page.find()

        return res.status(200).json({ pages });
        
    } catch (error) {
        return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
    }
}

export const getAllUsers = async(req, res) => {
    try {

        const users = await User.find()

        return res.status(200).json({ users });
        
    } catch (error) {
        return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
    }
}

export const getAllTemplates = async(req, res) => {
    try {

        const templates = await Template.find()

        return res.status(200).json({ templates });
        
    } catch (error) {
        return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
    }
}

export const getAllSubscribers = async(req, res) => {
    try {

        const subscribers = await Subscriber.find()

        return res.status(200).json({ subscribers });
        
    } catch (error) {
        return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
    }
}