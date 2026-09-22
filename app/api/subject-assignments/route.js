import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/lib/requireAuth";

import SubjectAssignment from "@/models/SubjectAssignment";
import Class from "@/models/Class";
import Subject from "@/models/Subject";
import Teacher from "@/models/Teacher";

// GET SUBJECT ASSIGNMENTS
export async function GET() {
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

    // Admin sees all assignments.
    // Teacher sees only their own assignments.
    const filter =
      auth.user.role === "teacher"
        ? {
            teacher: auth.user.teacherId,
            isActive: true,
          }
        : {};

    const assignments = await SubjectAssignment.find(
      filter
    )
      .populate({
        path: "class",
        select:
          "className section program teacher time room academicYear",
        populate: {
          path: "program",
          select: "name level system group",
        },
      })
      .populate(
        "subject",
        "name code description isActive"
      )
      .populate(
        "teacher",
        "name employeeId email specialization isActive"
      )
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        assignments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET subject assignments error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch subject assignments",
      },
      { status: 500 }
    );
  }
}

// CREATE OR UPDATE SUBJECT ASSIGNMENT
// ADMIN ONLY
export async function POST(request) {
  try {
    const auth = await requireAuth(["admin"]);

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

    const body = await request.json();

    const {
      classId,
      subjectId,
      teacherId,
    } = body;

    if (!classId || !subjectId || !teacherId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Class, subject and teacher are required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(classId) ||
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !mongoose.Types.ObjectId.isValid(teacherId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid class, subject or teacher ID",
        },
        { status: 400 }
      );
    }

    const [
      classItem,
      subject,
      teacher,
    ] = await Promise.all([
      Class.findById(classId),
      Subject.findById(subjectId),
      Teacher.findById(teacherId),
    ]);

    if (!classItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found",
        },
        { status: 404 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject not found",
        },
        { status: 404 }
      );
    }

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found",
        },
        { status: 404 }
      );
    }

    if (subject.isActive === false) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected subject is inactive",
        },
        { status: 400 }
      );
    }

    if (teacher.isActive === false) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected teacher is inactive",
        },
        { status: 400 }
      );
    }

    // If this class + subject already exists,
    // simply change its teacher.
    const assignment =
      await SubjectAssignment.findOneAndUpdate(
        {
          class: classId,
          subject: subjectId,
        },
        {
          teacher: teacherId,
          isActive: true,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      )
        .populate(
          "class",
          "className section program"
        )
        .populate(
          "subject",
          "name code description isActive"
        )
        .populate(
          "teacher",
          "name employeeId email specialization isActive"
        );

    return NextResponse.json(
      {
        success: true,
        message:
          "Subject teacher assigned successfully",
        assignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "POST subject assignment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to save subject assignment",
      },
      { status: 500 }
    );
  }
}