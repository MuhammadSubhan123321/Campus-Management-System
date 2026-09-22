import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";
import SubjectAssignment from "@/models/SubjectAssignment";
import { requireAuth } from "@/lib/requireAuth";

// GET students
// Admin   -> all students
// Teacher -> students from classes where they
//            have at least one subject assignment
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
      const students = await Student.find()
        .populate({
          path: "class",
          populate: [
            {
              path: "program",
            },
            {
              path: "teacher",
              select: "name employeeId email",
            },
          ],
        })
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          success: true,
          students,
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

    // Find every active subject assignment
    // belonging to the logged-in teacher.
    const assignments =
      await SubjectAssignment.find({
        teacher: auth.user.teacherId,
        isActive: true,
      }).select("class");

    // Get unique class IDs.
    const classIds = [
      ...new Set(
        assignments.map((assignment) =>
          assignment.class.toString()
        )
      ),
    ];

    // Teacher has no subject assignments.
    if (classIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          students: [],
        },
        { status: 200 }
      );
    }

    // Find students enrolled in those classes.
    const students = await Student.find({
      class: {
        $in: classIds,
      },
      isActive: true,
    })
      .populate({
        path: "class",
        populate: [
          {
            path: "program",
          },
          {
            path: "teacher",
            select: "name employeeId email",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        students,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET students error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
      },
      { status: 500 }
    );
  }
}

// CREATE student
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
      name,
      rollNumber,
      class: classId,
      gender,
      phone,
      guardianName,
      guardianPhone,
    } = body;

    if (
      !name ||
      !rollNumber ||
      !classId ||
      !gender
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, roll number, class and gender are required",
        },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({
      rollNumber: rollNumber.trim(),
      class: classId,
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A student with this roll number already exists in this class",
        },
        { status: 409 }
      );
    }

    const student = await Student.create({
      name,
      rollNumber,
      class: classId,
      gender,
      phone: phone || "",
      guardianName: guardianName || "",
      guardianPhone: guardianPhone || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student created successfully",
        student,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST student error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student",
      },
      { status: 500 }
    );
  }
}