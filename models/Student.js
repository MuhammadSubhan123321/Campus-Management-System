import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    guardianName: {
      type: String,
      trim: true,
      default: "",
    },

    guardianPhone: {
      type: String,
      trim: true,
      default: "",
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

// A roll number cannot be repeated inside the same class.
studentSchema.index(
  {
    class: 1,
    rollNumber: 1,
  },
  {
    unique: true,
  }
);

const Student =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

export default Student;