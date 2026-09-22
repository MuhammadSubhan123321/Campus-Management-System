import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Class from "@/models/Class";
import Program from "@/models/Program";
import Teacher from "@/models/Teacher";
import SubjectAssignment from "@/models/SubjectAssignment";
import { requireAuth } from "@/lib/requireAuth";

// GET ONE CLASS
// Admin -> any class
// Teacher -> class teacher OR subject teacher
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
          message: "Invalid class ID",
        },
        { status: 400 }
      );
    }

    const classItem = await Class.findById(id)
      .populate(
        "program",
        "name level group gradeFrom gradeTo system isActive"
      )
      .populate(
        "teacher",
        "name employeeId email specialization isActive"
      );

    if (!classItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // TEACHER PERMISSION
    // -----------------------------------------
    // Teacher can view this class if:
    // 1. They are the main/class teacher
    // OR
    // 2. They teach at least one subject here
    // -----------------------------------------

    if (auth.user.role === "teacher") {
      if (!auth.user.teacherId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Teacher account is not linked correctly",
          },
          { status: 403 }
        );
      }

      const classTeacherId =
        classItem.teacher?._id?.toString();

      const loggedInTeacherId =
        auth.user.teacherId.toString();

      const isClassTeacher =
        classTeacherId === loggedInTeacherId;

      const subjectAssignment =
        await SubjectAssignment.findOne({
          class: id,
          teacher: auth.user.teacherId,
          isActive: true,
        });

      const isSubjectTeacher =
        Boolean(subjectAssignment);

      if (!isClassTeacher && !isSubjectTeacher) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You do not have permission to view this class",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        class: classItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET class error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch class",
      },
      { status: 500 }
    );
  }
}

// UPDATE CLASS
// ADMIN ONLY
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
          message: "Invalid class ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      className,
      section,
      program,
      teacher,
      time,
      room,
      academicYear,
    } = body;

    if (
      !className ||
      !section ||
      !program ||
      !teacher ||
      !time
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Grade, section, program, teacher and time are required",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(program)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid program ID",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(teacher)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid teacher ID",
        },
        { status: 400 }
      );
    }

    // Make sure Program exists
    const programExists =
      await Program.findById(program);

    if (!programExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected program does not exist",
        },
        { status: 404 }
      );
    }

    if (!programExists.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected program is inactive",
        },
        { status: 400 }
      );
    }

    // Check selected grade is supported
    const gradeNumber = Number(
      className.replace("Grade ", "")
    );

    if (
      Number.isNaN(gradeNumber) ||
      gradeNumber < programExists.gradeFrom ||
      gradeNumber > programExists.gradeTo
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected program is not available for this grade",
        },
        { status: 400 }
      );
    }

    // Make sure Teacher exists
    const teacherExists =
      await Teacher.findById(teacher);

    if (!teacherExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected teacher does not exist",
        },
        { status: 404 }
      );
    }

    if (!teacherExists.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected teacher is inactive",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate Grade + Section
    const duplicateClass = await Class.findOne({
      _id: { $ne: id },
      className: className.trim(),
      section: section.trim(),
    });

    if (duplicateClass) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This class and section already exists",
        },
        { status: 409 }
      );
    }

    const updatedClass =
      await Class.findByIdAndUpdate(
        id,
        {
          className: className.trim(),
          section: section.trim(),
          program,
          teacher,
          time: time.trim(),
          room: room?.trim() || "",
          academicYear:
            academicYear?.trim() || "",
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "program",
          "name level group gradeFrom gradeTo system isActive"
        )
        .populate(
          "teacher",
          "name employeeId email specialization isActive"
        );

    if (!updatedClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Class updated successfully",
        class: updatedClass,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE class error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update class",
      },
      { status: 500 }
    );
  }
}

// DELETE CLASS
// ADMIN ONLY
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
          message: "Invalid class ID",
        },
        { status: 400 }
      );
    }

    const deletedClass =
      await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Class not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Class deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE class error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete class",
      },
      { status: 500 }
    );
  }
}