import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Class from "@/models/Class";
import Program from "@/models/Program";
import Teacher from "@/models/Teacher";
import SubjectAssignment from "@/models/SubjectAssignment";
import { requireAuth } from "@/lib/requireAuth";

// GET classes
// Admin   -> all classes
// Teacher -> classes where they have at least
//            one active subject assignment
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

    // -----------------------------
    // ADMIN
    // -----------------------------
    if (auth.user.role === "admin") {
      const classes = await Class.find()
        .populate(
          "program",
          "name level group gradeFrom gradeTo system"
        )
        .populate(
          "teacher",
          "name employeeId email specialization isActive"
        )
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          success: true,
          classes,
        },
        { status: 200 }
      );
    }

    // -----------------------------
    // TEACHER
    // -----------------------------
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

    // Find this teacher's subject assignments
    const assignments =
      await SubjectAssignment.find({
        teacher: auth.user.teacherId,
        isActive: true,
      }).select("class");

    // Get unique class IDs
    const classIds = [
      ...new Set(
        assignments.map((assignment) =>
          assignment.class.toString()
        )
      ),
    ];

    // No subject assignments = no classes
    if (classIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          classes: [],
        },
        { status: 200 }
      );
    }

    // Return only classes where this teacher
    // teaches at least one subject.
    const classes = await Class.find({
      _id: {
        $in: classIds,
      },
    })
      .populate(
        "program",
        "name level group gradeFrom gradeTo system"
      )
      .populate(
        "teacher",
        "name employeeId email specialization isActive"
      )
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        classes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET classes error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch classes",
      },
      { status: 500 }
    );
  }
}

// CREATE CLASS
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

    // Validate Program ID
    if (!mongoose.Types.ObjectId.isValid(program)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid program ID",
        },
        { status: 400 }
      );
    }

    // Validate Teacher ID
    if (!mongoose.Types.ObjectId.isValid(teacher)) {
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

    // Check Program supports selected grade
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
    const existingClass = await Class.findOne({
      className: className.trim(),
      section: section.trim(),
    });

    if (existingClass) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This class and section already exists",
        },
        { status: 409 }
      );
    }

    const newClass = await Class.create({
      className: className.trim(),
      section: section.trim(),
      program,
      teacher,
      time: time.trim(),
      room: room?.trim() || "",
      academicYear:
        academicYear?.trim() || "",
    });

    const populatedClass =
      await Class.findById(newClass._id)
        .populate(
          "program",
          "name level group gradeFrom gradeTo system"
        )
        .populate(
          "teacher",
          "name employeeId email specialization isActive"
        );

    return NextResponse.json(
      {
        success: true,
        message: "Class created successfully",
        class: populatedClass,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST class error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create class",
      },
      { status: 500 }
    );
  }
}