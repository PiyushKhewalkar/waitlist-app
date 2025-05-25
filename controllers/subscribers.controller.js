import Subscriber from "../models/subscriber.model.js";
import Page from "../models/page.model.js";
import { Parser } from "json2csv";

export const getSubscribers = async (req, res) => {
  try {
    const { pageId } = req.body;

    if (!pageId)
      return res.status(500).json({ message: "Page Id is required" });

    const page = await Page.findById(pageId);

    if (!page) return res.status(404).json({ message: "Page doesn't exist" });

    const subscribers = await Subscriber.find({ pageId });

    if (subscribers.length === 0)
      return res
        .status(500)
        .json({ message: "This page doesn't have any subscribers yet" });

    return res.status(200).json({ subscribers });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById({ id });

    if (!subscriber)
      return res.status(404).json({ message: "Subscriber not found" });

    return res.status(200).json({ subscriber });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete({ id });

    if (!subscriber)
      return res.status(404).json({ message: "Subscriber not found" });

    return res
      .status(200)
      .json({ message: "Subscriber deleted succesfully", subscriber });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const exportToCSV = async (req, res) => {
    try {
      const { pageId } = req.body;
  
      if (!pageId)
        return res.status(400).json({ message: "Page Id is required" });
  
      const page = await Page.findById(pageId);
      if (!page)
        return res.status(404).json({ message: "Page doesn't exist" });
  
      const subscribers = await Subscriber.find({ pageId });
      if (subscribers.length === 0)
        return res
          .status(400)
          .json({ message: "This page doesn't have any subscribers yet" });
  
      // Convert to CSV (with optional fields)
      const fields = ['name', 'email', 'createdAt']; // customize fields
      const parser = new Parser({ fields });
      const csv = parser.parse(subscribers);
  
      res.header("Content-Type", "text/csv");
      res.attachment(`subscribers-${pageId}.csv`);
      return res.send(csv);
  
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };