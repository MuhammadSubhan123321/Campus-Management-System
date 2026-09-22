import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Program from "@/models/Program";

// GET one program
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const program = await Program.findById(id);

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        program,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch program.",
      },
      { status: 500 }
    );
  }
}

// UPDATE program
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const name = body.name?.trim();
    const level = body.level;
    const system = body.system;
    const gradeFrom = Number(body.gradeFrom);
    const gradeTo = Number(body.gradeTo);

    if (
      !name ||
      !level ||
      !system ||
      !gradeFrom ||
      !gradeTo
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Program name, level, grades and education system are required.",
        },
        { status: 400 }
      );
    }

    if (
      gradeFrom < 1 ||
      gradeFrom > 12 ||
      gradeTo < 1 ||
      gradeTo > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Grades must be between 1 and 12.",
        },
        { status: 400 }
      );
    }

    if (gradeFrom > gradeTo) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Starting grade cannot be greater than ending grade.",
        },
        { status: 400 }
      );
    }

    const program = await Program.findByIdAndUpdate(
      id,
      {
        name,
        level,
        gradeFrom,
        gradeTo,
        system,
        group: body.group?.trim() || "",
        description: body.description?.trim() || "",
        isActive: body.isActive ?? true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Program updated successfully.",
        program,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update program.",
      },
      { status: 500 }
    );
  }
}

// DELETE program
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const program = await Program.findByIdAndDelete(id);

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Program deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete program.",
      },
      { status: 500 }
    );
  }
}