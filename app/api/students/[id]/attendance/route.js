import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";

import Attendance from "@/models/Attendance";
import Subject from "@/models/Subject";
import Class from "@/models/Class";
import Program from "@/models/Program";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";
import SubjectAssignment from "@/models/SubjectAssignment";

import { requireAuth } from "@/lib/requireAuth";

// =====================================
// GET STUDENT ATTENDANCE HISTORY
//
// Admin   -> all attendance for student
//
// Teacher -> only attendance records for
//            subjects that THIS teacher
//            is assigned to teach
//
// Student -> own attendance only
// =====================================

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth([
      "admin",
      "teacher",
      "student",
    ]);

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID",
        },
        { status: 400 }
      );
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    // =====================================
    // STUDENT SECURITY
    // =====================================

    if (auth.user.role === "student") {
      if (
        !auth.user.studentId ||
        auth.user.studentId !== id
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have permission to view this attendance history",
          },
          { status: 403 }
        );
      }
    }

    // =====================================
    // BUILD ATTENDANCE FILTER
    // =====================================

    let attendanceFilter = {
      "students.student": id,
    };

    // =====================================
    // TEACHER SECURITY
    // =====================================

    if (auth.user.role === "teacher") {
      if (!auth.user.teacherId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Teacher account is not linked to a teacher profile",
          },
          { status: 403 }
        );
      }

      // Find subjects THIS teacher teaches
      // in THIS student's class.

      const assignments =
        await SubjectAssignment.find({
          class: student.class,
          teacher: auth.user.teacherId,
          isActive: true,
        }).select("subject");

      if (assignments.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have permission to view this student's attendance",
          },
          { status: 403 }
        );
      }

      const subjectIds = assignments.map(
        (assignment) => assignment.subject
      );

      // Teacher only sees attendance for
      // their own assigned subjects.
      //
      // Example:
      // Subhan teaches Islamiyat ->
      // Subhan sees Islamiyat attendance.
      //
      // Ali teaches Physics ->
      // Subhan does NOT see Physics attendance.

      attendanceFilter = {
        "students.student": id,
        class: student.class,
        subject: {
          $in: subjectIds,
        },
      };
    }

    // =====================================
    // GET ATTENDANCE
    // =====================================

    const records =
      await Attendance.find(attendanceFilter)
        .populate({
          path: "subject",
          select: "name code",
        })
        .populate({
          path: "class",
          select:
            "className section program teacher academicYear",
          populate: [
            {
              path: "program",
              select: "name",
            },
            {
              path: "teacher",
              select: "name employeeId",
            },
          ],
        })
        .sort({
          date: -1,
          createdAt: -1,
        });

    // =====================================
    // FORMAT HISTORY
    // =====================================

    const attendanceHistory = records.map(
      (record) => {
        const studentAttendance =
          record.students.find(
            (item) =>
              item.student.toString() === id
          );

        return {
          attendanceId: record._id,

          date: record.date,

          status:
            studentAttendance?.status ||
            "Unknown",

          subject: record.subject
            ? {
                _id: record.subject._id,
                name: record.subject.name,
                code: record.subject.code,
              }
            : null,

          class: record.class
            ? {
                _id: record.class._id,

                className:
                  record.class.className,

                section:
                  record.class.section,

                academicYear:
                  record.class.academicYear,

                program:
                  record.class.program,

                teacher:
                  record.class.teacher,
              }
            : null,
        };
      }
    );

    return NextResponse.json(
      {
        success: true,

        student: {
          _id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
        },

        attendanceHistory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET student attendance history error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch student attendance history",
      },
      { status: 500 }
    );
  }
}