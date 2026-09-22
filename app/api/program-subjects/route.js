import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProgramSubject from "@/models/ProgramSubject";

// GET program-subject assignments
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const programId = searchParams.get("programId");
    const grade = searchParams.get("grade");

    const filter = {};

    if (programId) {
      filter.program = programId;
    }

    if (grade) {
      filter.grade = Number(grade);
    }

    const assignments = await ProgramSubject.find(filter)
      .populate("program")
      .populate("subject")
      .sort({ grade: 1, createdAt: 1 });

    return NextResponse.json(
      {
        success: true,
        assignments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET program subjects error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch program subjects.",
      },
      { status: 500 }
    );
  }
}

// ASSIGN subject to program + grade
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      programId,
      grade,
      subjectId,
      isCompulsory = true,
    } = body;

    if (!programId || !grade || !subjectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Program, grade and subject are required.",
        },
        { status: 400 }
      );
    }

    const gradeNumber = Number(grade);

    if (
      Number.isNaN(gradeNumber) ||
      gradeNumber < 1 ||
      gradeNumber > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Grade must be between 1 and 12.",
        },
        { status: 400 }
      );
    }

    const existingAssignment =
      await ProgramSubject.findOne({
        program: programId,
        grade: gradeNumber,
        subject: subjectId,
      });

    if (existingAssignment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This subject is already assigned to this program and grade.",
        },
        { status: 409 }
      );
    }

    const assignment = await ProgramSubject.create({
      program: programId,
      grade: gradeNumber,
      subject: subjectId,
      isCompulsory,
    });

    const populatedAssignment =
      await ProgramSubject.findById(assignment._id)
        .populate("program")
        .populate("subject");

    return NextResponse.json(
      {
        success: true,
        message: "Subject assigned successfully.",
        assignment: populatedAssignment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST program subject error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This subject is already assigned to this program and grade.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to assign subject.",
      },
      { status: 500 }
    );
  }
}