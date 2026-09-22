import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { requireAuth } from "@/lib/requireAuth";

// GET SUBJECTS
// Admin   -> all subjects
// Teacher -> active subjects only
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

    const filter =
      auth.user.role === "teacher"
        ? { isActive: true }
        : {};

    const subjects = await Subject.find(filter).sort({
      name: 1,
    });

    return NextResponse.json(
      {
        success: true,
        subjects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET subjects error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subjects.",
      },
      { status: 500 }
    );
  }
}

// ADD SUBJECT
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

    const name = body.name?.trim();
    const code =
      body.code?.trim().toUpperCase() || "";
    const description =
      body.description?.trim() || "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject name is required.",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate subject names
    const existingSubject =
      await Subject.findOne({
        name: {
          $regex: `^${name.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}$`,
          $options: "i",
        },
      });

    if (existingSubject) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A subject with this name already exists.",
        },
        { status: 409 }
      );
    }

    // Prevent duplicate subject codes
    if (code) {
      const existingCode =
        await Subject.findOne({ code });

      if (existingCode) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A subject with this code already exists.",
          },
          { status: 409 }
        );
      }
    }

    const subject = await Subject.create({
      name,
      code,
      description,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Subject added successfully.",
        subject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST subject error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add subject.",
      },
      { status: 500 }
    );
  }
}