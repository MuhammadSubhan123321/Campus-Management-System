import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";

import Attendance from "@/models/Attendance";
import SubjectAssignment from "@/models/SubjectAssignment";

import { requireAuth } from "@/lib/requireAuth";

// =====================================================
// GET ONE ATTENDANCE RECORD
// Admin   -> any record
// Teacher -> only exact class + subject assignments
// =====================================================
export async function GET(request, { params }) {
  try {
    const auth = await requireAuth([
      "admin",
      "teacher",
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
          message:
            "Invalid attendance record ID",
        },
        { status: 400 }
      );
    }

    const attendance =
      await Attendance.findById(id)
        .populate({
          path: "class",
          select:
            "className section program teacher time room academicYear",
          populate: [
            {
              path: "program",
              select:
                "name level gradeFrom gradeTo system group isActive",
            },
            {
              // This is intentionally kept.
              // It represents the CLASS TEACHER.
              path: "teacher",
              select:
                "name employeeId email specialization isActive",
            },
          ],
        })
        .populate({
          path: "subject",
          select:
            "name code description isActive",
        })
        .populate({
          path: "students.student",
          select:
            "name rollNumber gender phone guardianName guardianPhone isActive",
        });

    if (!attendance) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance record not found",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------
    // Find the teacher assigned to THIS SUBJECT
    // in THIS CLASS.
    // ---------------------------------------------
    const subjectAssignment =
      await SubjectAssignment.findOne({
        class: attendance.class?._id,
        subject: attendance.subject?._id,
        isActive: true,
      }).populate(
        "teacher",
        "name employeeId email specialization isActive"
      );

    // ---------------------------------------------
    // TEACHER PERMISSION CHECK
    // ---------------------------------------------
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

      const subjectTeacherId =
        subjectAssignment?.teacher?._id?.toString();

      if (
        !subjectTeacherId ||
        subjectTeacherId !==
          auth.user.teacherId.toString()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have permission to view this attendance record",
          },
          { status: 403 }
        );
      }
    }

    // Convert mongoose document to normal object
    // so we can add subjectTeacher.
    const attendanceObject =
      attendance.toObject();

    attendanceObject.subjectTeacher =
      subjectAssignment?.teacher || null;

    return NextResponse.json(
      {
        success: true,
        attendance: attendanceObject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET attendance record error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch attendance record",
      },
      { status: 500 }
    );
  }
}