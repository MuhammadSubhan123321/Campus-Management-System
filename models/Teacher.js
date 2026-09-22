import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    qualification: {
      type: String,
      trim: true,
      default: "",
    },

    specialization: {
      type: String,
      trim: true,
      default: "",
    },

    joiningDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher =
  mongoose.models.Teacher ||
  mongoose.model("Teacher", teacherSchema);

export default Teacher;