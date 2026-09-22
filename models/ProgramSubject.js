import mongoose from "mongoose";

const programSubjectSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    isCompulsory: {
      type: Boolean,
      default: true,
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

// Prevent same subject being assigned twice
// to the same program and grade.
programSubjectSchema.index(
  {
    program: 1,
    grade: 1,
    subject: 1,
  },
  {
    unique: true,
  }
);

const ProgramSubject =
  mongoose.models.ProgramSubject ||
  mongoose.model("ProgramSubject", programSubjectSchema);

export default ProgramSubject;