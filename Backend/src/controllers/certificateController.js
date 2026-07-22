const Certificate = require("../models/Certificate");
const Session = require("../models/Session");
const createNotification = require("../utils/createNotification");

// Get student's earned certificates
const getMyCertificates = async (req, res) => {
  try {
    const studentId = req.user.id;
    const certificates = await Certificate.find({ student: studentId })
      .populate("tutor", "name email")
      .sort({ issueDate: -1 });

    res.status(200).json({
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate certificate for completed subject/sessions milestone
const generateCertificate = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { tutorId, subject } = req.body;

    if (!tutorId || !subject) {
      return res.status(400).json({ message: "Tutor and Subject are required." });
    }

    const completedSessionsCount = await Session.countDocuments({
      student: studentId,
      tutor: tutorId,
      subject: subject,
      status: "Completed",
    });

    if (completedSessionsCount === 0) {
      return res.status(400).json({
        message: "You must complete at least 1 session in this subject with this tutor to generate a certificate.",
      });
    }

    const existingCert = await Certificate.findOne({
      student: studentId,
      tutor: tutorId,
      subject: subject,
    });

    if (existingCert) {
      return res.status(200).json({
        message: "Certificate already exists.",
        certificate: existingCert,
      });
    }

    const certificateId = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newCertificate = await Certificate.create({
      student: studentId,
      tutor: tutorId,
      subject,
      certificateId,
      totalSessionsCompleted: completedSessionsCount,
      issueDate: new Date(),
    });

    await createNotification({
      recipient: studentId,
      title: "Certificate Earned!",
      message: `Congratulations! You earned a Certificate of Completion for ${subject}.`,
      type: "system",
      link: "/student/certificates",
    });

    res.status(201).json({
      message: "Certificate generated successfully!",
      certificate: newCertificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyCertificates,
  generateCertificate,
};
