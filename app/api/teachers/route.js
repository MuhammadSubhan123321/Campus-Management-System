import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Teacher from "@/models/Teacher";

// GET all teachers
export async function GET() {
  try {
    await connectDB();

    const teachers = await Teacher.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        teachers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET teachers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch teachers",
      },
      { status: 500 }
    );
  }
}

// CREATE teacher
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      employeeId,
      email,
      phone,
      qualification,
      specialization,
      joiningDate,
    } = body;

    if (!name || !employeeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher name and employee ID are required",
        },
        { status: 400 }
      );
    }

    const existingTeacher = await Teacher.findOne({
      employeeId: employeeId.trim().toUpperCase(),
    });

    if (existingTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "A teacher with this employee ID already exists",
        },
        { status: 409 }
      );
    }

    const newTeacher = await Teacher.create({
      name: name.trim(),
      employeeId: employeeId.trim().toUpperCase(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      qualification: qualification?.trim() || "",
      specialization: specialization?.trim() || "",
      joiningDate: joiningDate || null,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Teacher added successfully",
        teacher: newTeacher,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST teacher error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add teacher",
      },
      { status: 500 }
    );
  }
}