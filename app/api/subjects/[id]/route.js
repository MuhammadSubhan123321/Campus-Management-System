import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";

// GET one subject
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const subject = await Subject.findById(id);

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET subject error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subject.",
      },
      { status: 500 }
    );
  }
}

// UPDATE subject
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const name = body.name?.trim();
    const code = body.code?.trim().toUpperCase() || "";
    const description = body.description?.trim() || "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject name is required.",
        },
        { status: 400 }
      );
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        code,
        description,
        isActive: body.isActive ?? true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subject updated successfully.",
        subject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT subject error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update subject.",
      },
      { status: 500 }
    );
  }
}

// DELETE subject
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subject deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE subject error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete subject.",
      },
      { status: 500 }
    );
  }
}