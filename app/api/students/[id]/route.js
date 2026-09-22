import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";

import Student from "@/models/Student";
import Class from "@/models/Class";
import Program from "@/models/Program";
import Teacher from "@/models/Teacher";
import SubjectAssignment from "@/models/SubjectAssignment";

import { requireAuth } from "@/lib/requireAuth";

// =====================================
// GET ONE STUDENT
// Admin   -> any student
// Teacher -> student from a class where
//            teacher has an active
//            subject assignment
// Student -> own profile only
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

    const student = await Student.findById(id).populate({
      path: "class",
      populate: [
        {
          path: "program",
        },
        {
          path: "teacher",
          select:
            "name employeeId email specialization",
        },
      ],
    });

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
    // ADMIN
    // =====================================

    if (auth.user.role === "admin") {
      return NextResponse.json(
        {
          success: true,
          student,
        },
        { status: 200 }
      );
    }

    // =====================================
    // TEACHER
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

      if (!student.class?._id) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Student is not assigned to a class",
          },
          { status: 403 }
        );
      }

      // IMPORTANT:
      // We do NOT check student.class.teacher here.
      //
      // Class.teacher = class/homeroom teacher.
      //
      // Teacher access to students is based on
      // SubjectAssignment.

      const assignment =
        await SubjectAssignment.findOne({
          class: student.class._id,
          teacher: auth.user.teacherId,
          isActive: true,
        }).select("_id");

      if (!assignment) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have permission to view this student",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          student,
        },
        { status: 200 }
      );
    }

    // =====================================
    // STUDENT
    // =====================================

    if (auth.user.role === "student") {
      if (
        !auth.user.studentId ||
        id !== auth.user.studentId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have permission to view this student",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          student,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Access denied",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("GET student error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch student",
      },
      { status: 500 }
    );
  }
}

// =====================================
// UPDATE STUDENT
// ADMIN ONLY
// =====================================

export async function PUT(request, { params }) {
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

    const body = await request.json();

    const {
      name,
      rollNumber,
      class: classId,
      gender,
      phone,
      guardianName,
      guardianPhone,
      isActive,
    } = body;

    if (
      !name ||
      !rollNumber ||
      !classId ||
      !gender
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, roll number, class and gender are required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(classId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid class ID",
        },
        { status: 400 }
      );
    }

    const classExists =
      await Class.findById(classId);

    if (!classExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected class does not exist",
        },
        { status: 404 }
      );
    }

    const duplicateStudent =
      await Student.findOne({
        _id: { $ne: id },
        rollNumber: rollNumber.trim(),
        class: classId,
      });

    if (duplicateStudent) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A student with this roll number already exists in this class",
        },
        { status: 409 }
      );
    }

    const student =
      await Student.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          class: classId,
          gender,
          phone: phone?.trim() || "",
          guardianName:
            guardianName?.trim() || "",
          guardianPhone:
            guardianPhone?.trim() || "",
          ...(typeof isActive === "boolean"
            ? { isActive }
            : {}),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Student updated successfully",
        student,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE student error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update student",
      },
      { status: 500 }
    );
  }
}

// =====================================
// DELETE STUDENT
// ADMIN ONLY
// =====================================

export async function DELETE(request, { params }) {
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

    const student =
      await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Student deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE student error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete student",
      },
      { status: 500 }
    );
  }
}