import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    room: {
      type: String,
      trim: true,
      default: "",
    },

    academicYear: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Class =
  mongoose.models.Class ||
  mongoose.model("Class", classSchema);

export default Class;