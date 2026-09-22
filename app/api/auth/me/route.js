import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

// These imports are needed so Mongoose knows
// about the referenced models during populate.
import "@/models/Teacher";
import "@/models/Student";
import "@/models/Class";

export async function GET() {
  try {
    // --------------------------------
    // GET SESSION COOKIE
    // --------------------------------

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // --------------------------------
    // VERIFY SESSION
    // --------------------------------

    const session = await verifyToken(token);

    if (!session?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    // --------------------------------
    // CONNECT DATABASE
    // --------------------------------

    await connectDB();

    // --------------------------------
    // GET CURRENT USER
    // --------------------------------

    const user = await User.findById(session.userId)
      .select("-password")

      // Teacher profile
      .populate({
        path: "teacher",
        select:
          "name employeeId email phone qualification specialization joiningDate isActive",
      })

      // Student profile
      .populate({
        path: "student",
        select:
          "name rollNumber class gender phone guardianName guardianPhone isActive",

        // Student stores the Class ID.
        // Section and grade belong to the Class.
        populate: {
          path: "class",
          select:
            "className section program teacher time room academicYear",
        },
      });

    // --------------------------------
    // USER NOT FOUND
    // --------------------------------

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // ACCOUNT INACTIVE
    // --------------------------------

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is inactive",
        },
        { status: 403 }
      );
    }

    // --------------------------------
    // RETURN CURRENT USER
    // --------------------------------

    return NextResponse.json(
      {
        success: true,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,

          teacher: user.teacher || null,
          student: user.student || null,

          isActive: user.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET current user error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get current user",
      },
      { status: 500 }
    );
  }
}