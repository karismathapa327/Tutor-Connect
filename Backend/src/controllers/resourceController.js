const Resource = require("../models/Resource");

// Upload / Create Resource
const createResource = async (req, res) => {
  try {
    const { title, description, subject, fileType, externalUrl } = req.body;

    let fileUrl = externalUrl;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!fileUrl && !externalUrl) {
      return res.status(400).json({ message: "File or link is required." });
    }

    const resource = await Resource.create({
      tutor: req.user.id,
      title,
      description,
      subject,
      fileType: fileType || "PDF",
      fileUrl: fileUrl,
    });

    res.status(201).json({
      message: "Resource uploaded successfully.",
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all resources (accessible by student and tutor)
const getAllResources = async (req, res) => {
  try {
    const { subject, fileType, search } = req.query;

    const query = {};
    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (fileType) query.fileType = fileType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query)
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: resources.length,
      resources,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    if (resource.tutor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this resource." });
    }

    await resource.deleteOne();
    res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResource,
  getAllResources,
  deleteResource,
};
