import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Subject from "@/models/Subject";

import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  try {
    // STUDENT ONLY
    const auth = await requireAuth(["student"]);

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    if (!auth.user.studentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Student account is not linked to a student record",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const student = await Student.findById(
      auth.user.studentId
    ).populate({
      path: "class",
      select: "className section",
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student record not found",
        },
        { status: 404 }
      );
    }

    const records = await Attendance.find({
      "students.student": student._id,
    })
      .populate({
        path: "subject",
        select: "name code",
      })
      .populate({
        path: "class",
        select: "className section",
      })
      .sort({
        date: -1,
        createdAt: -1,
      });

    const history = [];

    const subjectMap = {};

    for (const record of records) {
      const studentAttendance =
        record.students.find(
          (item) =>
            item.student.toString() ===
            student._id.toString()
        );

      if (!studentAttendance) {
        continue;
      }

      const subjectId =
        record.subject?._id?.toString();

      const subjectName =
        record.subject?.name ||
        "Unknown Subject";

      const subjectCode =
        record.subject?.code || "";

      history.push({
        recordId: record._id,
        date: record.date,

        subject: {
          id: subjectId || null,
          name: subjectName,
          code: subjectCode,
        },

        class: {
          name:
            record.class?.className || "",
          section:
            record.class?.section || "",
        },

        status: studentAttendance.status,
      });

      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = {
          subjectId,
          subjectName,
          subjectCode,
          total: 0,
          present: 0,
          absent: 0,
          percentage: 0,
        };
      }

      subjectMap[subjectId].total += 1;

      if (
        studentAttendance.status ===
        "Present"
      ) {
        subjectMap[subjectId].present += 1;
      }

      if (
        studentAttendance.status ===
        "Absent"
      ) {
        subjectMap[subjectId].absent += 1;
      }
    }

    const subjectSummary =
      Object.values(subjectMap).map(
        (subject) => ({
          ...subject,

          percentage:
            subject.total > 0
              ? Math.round(
                  (subject.present /
                    subject.total) *
                    100
                )
              : 0,
        })
      );

    const totalRecords = history.length;

    const presentCount = history.filter(
      (item) => item.status === "Present"
    ).length;

    const absentCount = history.filter(
      (item) => item.status === "Absent"
    ).length;

    const overallPercentage =
      totalRecords > 0
        ? Math.round(
            (presentCount /
              totalRecords) *
              100
          )
        : 0;

    return NextResponse.json(
      {
        success: true,

        student: {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,

          class: student.class
            ? {
                id: student.class._id,
                className:
                  student.class.className,
                section:
                  student.class.section,
              }
            : null,
        },

        overall: {
          total: totalRecords,
          present: presentCount,
          absent: absentCount,
          percentage: overallPercentage,
        },

        subjectSummary,

        history,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET student attendance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch student attendance",
      },
      { status: 500 }
    );
  }
}