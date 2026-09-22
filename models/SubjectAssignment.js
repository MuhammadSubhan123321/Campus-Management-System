import mongoose from "mongoose";

const subjectAssignmentSchema =
  new mongoose.Schema(
    {
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },

      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },

      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
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

// One subject in one class has one assigned teacher
subjectAssignmentSchema.index(
  {
    class: 1,
    subject: 1,
  },
  {
    unique: true,
  }
);

const SubjectAssignment =
  mongoose.models.SubjectAssignment ||
  mongoose.model(
    "SubjectAssignment",
    subjectAssignmentSchema
  );

export default SubjectAssignment;