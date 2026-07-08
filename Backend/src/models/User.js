const mongoose = require("mongoose");

// Create the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
module.exports = mongoose.model("User", userSchema);