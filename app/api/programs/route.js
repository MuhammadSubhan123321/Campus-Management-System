import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Program from "@/models/Program";

// GET all programs
export async function GET() {
  try {
    await connectDB();

    const programs = await Program.find().sort({
      gradeFrom: 1,
      name: 1,
    });

    return NextResponse.json(
      {
        success: true,
        programs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET programs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch programs.",
      },
      { status: 500 }
    );
  }
}

// CREATE program
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      level,
      gradeFrom,
      gradeTo,
      system,
      group,
      description,
    } = body;

    if (
      !name?.trim() ||
      !level ||
      !gradeFrom ||
      !gradeTo ||
      !system
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Program name, level, grades and system are required.",
        },
        { status: 400 }
      );
    }

    const from = Number(gradeFrom);
    const to = Number(gradeTo);

    if (from < 1 || from > 12 || to < 1 || to > 12) {
      return NextResponse.json(
        {
          success: false,
          message: "Grades must be between 1 and 12.",
        },
        { status: 400 }
      );
    }

    if (from > to) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Starting grade cannot be greater than ending grade.",
        },
        { status: 400 }
      );
    }

    const program = await Program.create({
      name: name.trim(),
      level,
      gradeFrom: from,
      gradeTo: to,
      system,
      group: group?.trim() || "",
      description: description?.trim() || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Program added successfully.",
        program,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add program.",
      },
      { status: 500 }
    );
  }
}