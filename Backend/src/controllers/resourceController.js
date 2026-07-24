const resourceService = require("../services/resource.service");

const getAllResources = async (req, res) => {
  try {
    const result = await resourceService.getAllResources(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const resourceData = {
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      fileType: req.body.fileType || "PDF",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl,
    };

    const result = await resourceService.createResource(tutorId, resourceData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await resourceService.deleteResource(req.params.id, tutorId);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("authorized") ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getAllResources,
  createResource,
  deleteResource,
};
