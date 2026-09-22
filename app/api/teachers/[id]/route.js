import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Teacher from "@/models/Teacher";

// GET one teacher
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid teacher ID",
        },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        teacher,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET teacher error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch teacher",
      },
      { status: 500 }
    );
  }
}

// UPDATE one teacher
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid teacher ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      employeeId,
      email,
      phone,
      qualification,
      specialization,
      joiningDate,
      isActive,
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

    const duplicateTeacher = await Teacher.findOne({
      _id: { $ne: id },
      employeeId: employeeId.trim().toUpperCase(),
    });

    if (duplicateTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "A teacher with this employee ID already exists",
        },
        { status: 409 }
      );
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        employeeId: employeeId.trim().toUpperCase(),
        email: email?.trim() || "",
        phone: phone?.trim() || "",
        qualification: qualification?.trim() || "",
        specialization: specialization?.trim() || "",
        joiningDate: joiningDate || null,
        isActive: isActive ?? true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Teacher updated successfully",
        teacher: updatedTeacher,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE teacher error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update teacher",
      },
      { status: 500 }
    );
  }
}

// DELETE one teacher
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid teacher ID",
        },
        { status: 400 }
      );
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Teacher deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE teacher error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete teacher",
      },
      { status: 500 }
    );
  }
}