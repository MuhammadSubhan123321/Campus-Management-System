import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProgramSubject from "@/models/ProgramSubject";

// UPDATE one program-subject assignment
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const updateData = {};

    if (body.isCompulsory !== undefined) {
      updateData.isCompulsory = body.isCompulsory;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    const assignment = await ProgramSubject.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("program")
      .populate("subject");

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Program subject assignment not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subject assignment updated successfully.",
        assignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT program subject error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update subject assignment.",
      },
      { status: 500 }
    );
  }
}

// DELETE one program-subject assignment
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const assignment = await ProgramSubject.findByIdAndDelete(id);

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Program subject assignment not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subject removed from program successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE program subject error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove subject from program.",
      },
      { status: 500 }
    );
  }
}