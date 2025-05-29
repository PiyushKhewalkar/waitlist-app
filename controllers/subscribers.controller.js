import Subscriber from "../models/subscriber.model.js";
import Page from "../models/page.model.js";
import { Parser } from "json2csv";

export const getSubscribers = async (req, res) => {
  try {
    const { pageId } = req.params;

    if (!pageId)
      return res.status(500).json({ message: "Page Id is required" });

    const page = await Page.findOne({ _id: pageId, userId: req.user._id });
    if (!page)
      return res.status(404).json({ message: "Page not found or not yours" });

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

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);
    if (!subscriber)
      return res.status(404).json({ message: "Subscriber not found" });

    // Check if logged-in user owns the page that subscriber belongs to
    const page = await Page.findOne({
      _id: subscriber.pageId,
      userId: req.user._id,
    });
    if (!page) return res.status(403).json({ message: "Unauthorized" });

    await subscriber.deleteOne();

    return res
      .status(200)
      .json({ message: "Subscriber deleted successfully", subscriber });
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

    const page = await Page.findOne({ _id: pageId, userId: req.user._id });
    
    if (!page) return res.status(404).json({ message: "Page not found or not yours" });

    const subscribers = await Subscriber.find({ pageId });
    if (subscribers.length === 0)
      return res
        .status(400)
        .json({ message: "This page doesn't have any subscribers yet" });

    // Convert to CSV (with optional fields)
    const fields = ["name", "email", "createdAt"]; // customize fields
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

export const addSubscriber = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { name, email, phone } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the corresponding page
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Save new subscriber
    const newSubscriber = new Subscriber({
      name: name || null,
      email,
      phone: phone || null,
      pageId,
    });

    page.subscribers += 1;

    await page.save()

    await newSubscriber.save();

    return res
      .status(201)
      .json({
        message: "Subscriber added successfully",
        subscriber: newSubscriber,
      });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
