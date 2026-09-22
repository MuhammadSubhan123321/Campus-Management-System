import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      required: true,
      enum: [
        "Primary",
        "Middle",
        "Secondary",
        "Higher Secondary",
      ],
    },

    gradeFrom: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    gradeTo: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    system: {
      type: String,
      required: true,
      enum: [
        "General",
        "Matric",
        "Intermediate",
        "O Level",
        "A Level",
      ],
    },

    group: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
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

const Program =
  mongoose.models.Program ||
  mongoose.model("Program", programSchema);

export default Program;