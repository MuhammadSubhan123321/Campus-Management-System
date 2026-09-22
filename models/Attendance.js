import mongoose from "mongoose";

const attendanceStudentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const attendanceSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: true,
    },

    students: {
      type: [attendanceStudentSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One attendance record per:
// Class + Subject + Date
attendanceSchema.index(
  {
    class: 1,
    subject: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

const Attendance =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);

export default Attendance;