const Resource = require("../models/Resource");

class ResourceService {
  async getAllResources(queryParams) {
    const query = {};

    if (queryParams.subject) {
      query.subject = { $regex: queryParams.subject, $options: "i" };
    }

    const resources = await Resource.find(query)
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    return {
      count: resources.length,
      resources,
    };
  }

  async createResource(tutorId, resourceData) {
    const resource = await Resource.create({
      tutor: tutorId,
      title: resourceData.title,
      description: resourceData.description,
      subject: resourceData.subject,
      fileType: resourceData.fileType || "PDF",
      fileUrl: resourceData.fileUrl,
    });

    return resource;
  }

  async deleteResource(resourceId, tutorId) {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      throw new Error("Resource not found.");
    }

    if (resource.tutor.toString() !== tutorId) {
      throw new Error("You are not authorized to delete this resource.");
    }

    await Resource.deleteOne({ _id: resourceId });

    return { message: "Resource deleted successfully." };
  }
}

module.exports = new ResourceService();
