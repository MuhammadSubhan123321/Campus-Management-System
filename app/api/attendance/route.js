import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";

import Attendance from "@/models/Attendance";
import Class from "@/models/Class";
import Student from "@/models/Student";
import Subject from "@/models/Subject";
import SubjectAssignment from "@/models/SubjectAssignment";

import { requireAuth } from "@/lib/requireAuth";

// =====================================================
// ATTENDANCE TIME SETTINGS
// Pakistan school attendance window for teachers
// =====================================================
const PAKISTAN_TIME_ZONE = "Asia/Karachi";
const TEACHER_START_HOUR = 8; // 8:00 AM
const TEACHER_END_HOUR = 17; // 5:00 PM

// Get current Pakistan date/time.
// This does NOT depend on the teacher's laptop clock.
function getPakistanNow() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: PAKISTAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());

  const values = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

// Strictly check YYYY-MM-DD.
function isValidDateString(date) {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const [year, month, day] = date
    .split("-")
    .map(Number);

  const checkDate = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    checkDate.getUTCFullYear() === year &&
    checkDate.getUTCMonth() === month - 1 &&
    checkDate.getUTCDate() === day
  );
}

// Store attendance consistently at UTC midnight.
// This avoids server/local timezone differences.
function createAttendanceDate(date) {
  return new Date(`${date}T00:00:00.000Z`);
}

// =====================================================
// GET ATTENDANCE RECORDS
// Admin   -> all records
// Teacher -> only records for subjects assigned to them
// =====================================================
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

    let filter = {};

    // ---------------------------------------------
    // TEACHER:
    // Find exact class + subject combinations
    // assigned to the logged-in teacher.
    // ---------------------------------------------
    if (auth.user.role === "teacher") {
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

      const assignments =
        await SubjectAssignment.find({
          teacher: auth.user.teacherId,
          isActive: true,
        }).select("class subject");

      if (assignments.length === 0) {
        return NextResponse.json(
          {
            success: true,
            records: [],
          },
          { status: 200 }
        );
      }

      filter = {
        $or: assignments.map((assignment) => ({
          class: assignment.class,
          subject: assignment.subject,
        })),
      };
    }

    const records = await Attendance.find(filter)
      .populate({
        path: "class",
        select:
          "className section program teacher time room academicYear",
        populate: [
          {
            path: "program",
            select: "name level system group",
          },
          {
            path: "teacher",
            select: "name employeeId email",
          },
        ],
      })
      .populate({
        path: "subject",
        select: "name code description isActive",
      })
      .populate({
        path: "students.student",
        select: "name rollNumber gender isActive",
      })
      .sort({
        date: -1,
        createdAt: -1,
      });

    // Attach subject teacher to each record.
    const recordsWithSubjectTeachers =
      await Promise.all(
        records.map(async (record) => {
          const recordObject = record.toObject();

          const assignment =
            await SubjectAssignment.findOne({
              class: record.class?._id,
              subject: record.subject?._id,
              isActive: true,
            }).populate(
              "teacher",
              "name employeeId email specialization isActive"
            );

          return {
            ...recordObject,
            subjectTeacher:
              assignment?.teacher || null,
          };
        })
      );

    return NextResponse.json(
      {
        success: true,
        records: recordsWithSubjectTeachers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET attendance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch attendance records",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// CREATE ATTENDANCE RECORD
//
// ADMIN:
// - today or past date
// - future date NOT allowed
// - no school-hours restriction
//
// TEACHER:
// - today ONLY
// - 8:00 AM to 5:00 PM Pakistan time ONLY
// - only exact class + subject assigned to them
// =====================================================
export async function POST(request) {
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

    const body = await request.json();

    const {
      classId,
      subjectId,
      date,
      students,
    } = body;

    if (
      !classId ||
      !subjectId ||
      !date ||
      !Array.isArray(students) ||
      students.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Class, subject, date and student attendance are required",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Validate IDs
    // ---------------------------------------------
    if (
      !mongoose.Types.ObjectId.isValid(classId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid class ID",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid subject ID",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Validate date format first
    // ---------------------------------------------
    if (!isValidDateString(date)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid attendance date",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // DATE + TIME PERMISSION
    // ---------------------------------------------
    const pakistanNow = getPakistanNow();
    const today = pakistanNow.date;

    // Nobody can mark future attendance.
    if (date > today) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance cannot be marked for a future date",
        },
        { status: 400 }
      );
    }

    // Teacher can ONLY mark today's attendance.
    if (
      auth.user.role === "teacher" &&
      date !== today
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Teachers can only mark attendance for today",
        },
        { status: 403 }
      );
    }

    // Teacher can only submit during school hours.
    if (auth.user.role === "teacher") {
      const currentMinutes =
        pakistanNow.hour * 60 +
        pakistanNow.minute;

      const startMinutes =
        TEACHER_START_HOUR * 60;

      const endMinutes =
        TEACHER_END_HOUR * 60;

      if (
        currentMinutes < startMinutes ||
        currentMinutes > endMinutes
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Teachers can mark attendance only between 8:00 AM and 5:00 PM Pakistan time",
          },
          { status: 403 }
        );
      }
    }

    // ---------------------------------------------
    // Make sure class exists
    // ---------------------------------------------
    const classExists =
      await Class.findById(classId);

    if (!classExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected class does not exist",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------
    // Make sure subject exists and is active
    // ---------------------------------------------
    const subjectExists =
      await Subject.findOne({
        _id: subjectId,
        isActive: true,
      });

    if (!subjectExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected subject does not exist or is inactive",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------
    // Class + Subject must have active assignment
    // ---------------------------------------------
    const subjectAssignment =
      await SubjectAssignment.findOne({
        class: classId,
        subject: subjectId,
        isActive: true,
      });

    if (!subjectAssignment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This subject is not assigned to a teacher for the selected class",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // TEACHER ASSIGNMENT PERMISSION
    // ---------------------------------------------
    if (auth.user.role === "teacher") {
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

      if (
        subjectAssignment.teacher.toString() !==
        auth.user.teacherId.toString()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You can only mark attendance for subjects assigned to you",
          },
          { status: 403 }
        );
      }
    }

    // ---------------------------------------------
    // Convert YYYY-MM-DD to stored Date
    // ---------------------------------------------
    const attendanceDate =
      createAttendanceDate(date);

    // ---------------------------------------------
    // Prevent duplicate attendance
    // Class + Subject + Date
    // ---------------------------------------------
    const existingAttendance =
      await Attendance.findOne({
        class: classId,
        subject: subjectId,
        date: attendanceDate,
      });

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance for this class, subject and date already exists",
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------
    // Validate attendance entries
    // ---------------------------------------------
    for (const item of students) {
      if (
        !item.student ||
        !mongoose.Types.ObjectId.isValid(
          item.student
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more student IDs are invalid",
          },
          { status: 400 }
        );
      }

      if (
        !["Present", "Absent"].includes(
          item.status
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Attendance status must be Present or Absent",
          },
          { status: 400 }
        );
      }
    }

    // ---------------------------------------------
    // Prevent duplicate student entries
    // ---------------------------------------------
    const studentIds = students.map((item) =>
      item.student.toString()
    );

    const uniqueStudentIds =
      new Set(studentIds);

    if (
      uniqueStudentIds.size !==
      studentIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A student cannot appear more than once in the same attendance record",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Make sure submitted students belong
    // to this exact class and are active
    // ---------------------------------------------
    const validStudents =
      await Student.find({
        _id: {
          $in: studentIds,
        },
        class: classId,
        isActive: true,
      }).select("_id");

    if (
      validStudents.length !==
      students.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more students do not belong to the selected class or are inactive",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Create attendance
    // ---------------------------------------------
    const attendance =
      await Attendance.create({
        class: classId,
        subject: subjectId,
        date: attendanceDate,

        students: students.map((item) => ({
          student: item.student,
          status: item.status,
        })),
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Attendance saved successfully",
        attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST attendance error:",
      error
    );

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Attendance for this class, subject and date already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to save attendance",
      },
      { status: 500 }
    );
  }
}