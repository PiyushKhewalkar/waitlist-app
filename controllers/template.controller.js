import Template from "../models/template.model.js";

export const getTemplates = async (req, res) => {
  try {

    const templates = await Template.find()

    return res.status(200).json({templates})

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details : error.message });
  }
};

export const getTemplate = async (req, res) => {
  try {

    const {id} = req.params

    const template = await Template.findById(id)

    if (!template) return res.status(404).json({message: "template not found"})

    return res.status(200).json({template})

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details : error.message });
  }
};

export const createTemplate = async (req, res) => {
    try {
      console.log("Received body:", req.body); // 👈 Add this
  
      const { templateNumber, name, description, templateCode, responseFormat } = req.body;
  
      const newTemplate = new Template({
        templateNumber,
        name,
        description,
        templateCode,
        responseFormat,
      });
  
      await newTemplate.save();
  
      return res.status(201).json({
        message: "Template created successfully",
        newTemplate,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
};


export const updateTemplate = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = req.body;
  
      const updatedTemplate = await Template.findByIdAndUpdate(id, data, { new: true });
  
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Template updated successfully", updatedTemplate });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error });
    }
  };

  
export const deleteTemplate = async(req, res) => {
    try {

        const {id} = req.params

        const deletedTemplate = await Template.findByIdAndDelete(id)

        return res.status(201).json({message: "template deleted succesfully", deletedTemplate})
        
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details : error.message });
    }
}