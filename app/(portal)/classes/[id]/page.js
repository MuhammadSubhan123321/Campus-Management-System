"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  GraduationCap,
  Hash,
  IdCard,
  Layers3,
  ListChecks,
  MapPin,
  School,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClassDetailPage() {
  const params = useParams();
  const id = params.id;

  const [classItem, setClassItem] =
    useState(null);

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD CLASS + STUDENTS
  // =========================================
  useEffect(() => {
    async function fetchClassData() {
      try {
        setLoading(true);
        setError("");

        // -------------------------------------
        // LOAD CLASS
        // -------------------------------------
        const classResponse = await fetch(
          `/api/classes/${id}`,
          {
            cache: "no-store",
          }
        );

        const classData =
          await classResponse.json();

        if (!classResponse.ok) {
          throw new Error(
            classData.message ||
              "Failed to load class."
          );
        }

        setClassItem(classData.class);

        // -------------------------------------
        // LOAD STUDENTS
        // -------------------------------------
        const studentsResponse =
          await fetch("/api/students", {
            cache: "no-store",
          });

        const studentsData =
          await studentsResponse.json();

        if (!studentsResponse.ok) {
          throw new Error(
            studentsData.message ||
              "Failed to load students."
          );
        }

        // Student stores class as:
        // student.class._id
        //
        // Compare that ObjectId with the
        // currently loaded class ObjectId.
        const classStudents = (
          studentsData.students || []
        ).filter(
          (student) =>
            student.class?._id?.toString() ===
            classData.class._id?.toString()
        );

        setStudents(classStudents);
      } catch (error) {
        console.error(
          "Class detail error:",
          error
        );

        setError(
          error.message ||
            "Failed to load class."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchClassData();
    }
  }, [id]);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading class...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error || !classItem) {
    return (
      <div className="space-y-5">
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classes
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error || "Class not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href="/classes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Classes
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <School className="h-4 w-4" />
            Class Profile
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {classItem.className}
            </h1>

            <Badge className="border-0 bg-orange-100 px-3 py-1 text-orange-700 hover:bg-orange-100">
              Section {classItem.section}
            </Badge>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            View class information,
            enrolled students and attendance
            options.
          </p>
        </div>

        {/* TOTAL STUDENTS */}
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-5 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <UsersRound className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Enrolled Students
            </p>

            <p className="text-xl font-bold text-slate-900">
              {students.length}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ===================================
            CLASS INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Class Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Academic, teacher and
                  schedule information for
                  this class.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <InformationItem
                icon={GraduationCap}
                label="Grade"
                value={classItem.className}
                iconClass="bg-teal-50 text-teal-700"
              />

              <InformationItem
                icon={Layers3}
                label="Section"
                value={classItem.section}
                iconClass="bg-orange-50 text-orange-600"
              />

              <InformationItem
                icon={BookOpenCheck}
                label="Academic Program"
                value={
                  classItem.program?.name ||
                  "Not assigned"
                }
                iconClass="bg-blue-50 text-blue-600"
              />

              <InformationItem
                icon={School}
                label="Education System"
                value={
                  classItem.program?.system ||
                  "Not provided"
                }
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <InformationItem
                icon={Hash}
                label="Program Group"
                value={
                  classItem.program?.group ||
                  "Not specified"
                }
                iconClass="bg-amber-50 text-amber-600"
              />

              {/* CLASS TEACHER */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <UserRoundCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Class Teacher
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {classItem.teacher?.name ||
                      "Not assigned"}
                  </p>

                  {classItem.teacher
                    ?.employeeId && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <IdCard className="h-3.5 w-3.5" />

                      {
                        classItem.teacher
                          .employeeId
                      }
                    </div>
                  )}
                </div>
              </div>

              <InformationItem
                icon={Clock3}
                label="Class Time"
                value={
                  classItem.time ||
                  "Not provided"
                }
                iconClass="bg-orange-50 text-orange-600"
              />

              <InformationItem
                icon={Building2}
                label="Room"
                value={
                  classItem.room ||
                  "Not provided"
                }
                iconClass="bg-blue-50 text-blue-600"
              />

              <InformationItem
                icon={CalendarDays}
                label="Academic Year"
                value={
                  classItem.academicYear ||
                  "Not provided"
                }
                iconClass="bg-teal-50 text-teal-700"
              />

              <InformationItem
                icon={UsersRound}
                label="Total Students"
                value={students.length}
                iconClass="bg-emerald-50 text-emerald-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            CLASS ACTIONS
        ==================================== */}
        <div className="space-y-5">
          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/60 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <ListChecks className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Class Actions
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Attendance tools
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="space-y-3 p-5">
              {/* MARK ATTENDANCE */}
              <Link
                href={`/attendance/mark?classId=${classItem._id}`}
                className="group flex items-center justify-between rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Attendance
                </span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* RECORDS */}
              <Link
                href={`/attendance/records?classId=${classItem._id}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
              >
                <span className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Attendance Records
                </span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </CardContent>
          </Card>

          {/* CLASS SUMMARY */}
          <Card className="rounded-2xl border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <School className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                {classItem.className} -{" "}
                Section {classItem.section}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {classItem.program?.name ||
                  "No academic program assigned"}
              </p>

              <div className="mt-4 space-y-2 border-t border-teal-100 pt-4">
                <MiniDetail
                  icon={UsersRound}
                  text={`${students.length} enrolled ${
                    students.length === 1
                      ? "student"
                      : "students"
                  }`}
                />

                <MiniDetail
                  icon={Clock3}
                  text={
                    classItem.time ||
                    "No class time"
                  }
                />

                <MiniDetail
                  icon={MapPin}
                  text={
                    classItem.room ||
                    "No room assigned"
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* =====================================
          STUDENTS
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-teal-700" />

              <h2 className="text-lg font-bold text-slate-900">
                Students
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Students enrolled in this class.
            </p>
          </div>

          <Badge className="w-fit border-0 bg-teal-50 px-3 py-1.5 text-teal-700 hover:bg-teal-50">
            {students.length}{" "}
            {students.length === 1
              ? "Student"
              : "Students"}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="px-6 font-semibold text-slate-600">
                  Roll No.
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Student Name
                </TableHead>

                <TableHead className="pr-6 text-right font-semibold text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <UsersRound className="h-6 w-6" />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        No students enrolled
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        No students are currently
                        assigned to this class.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map(
                  (student) => (
                    <TableRow
                      key={student._id}
                      className="border-slate-100 transition-colors hover:bg-teal-50/40"
                    >
                      {/* ROLL NUMBER */}
                      <TableCell className="px-6">
                        <Badge className="border-0 bg-slate-100 text-slate-600 hover:bg-slate-100">
                          {student.rollNumber}
                        </Badge>
                      </TableCell>

                      {/* STUDENT */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                            {student.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "S"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {student.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Student
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* ACTION */}
                      <TableCell className="pr-6 text-right">
                        <Link
                          href={`/students/${student._id}`}
                          title="View student"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ===========================================
// INFORMATION ITEM
// ===========================================
function InformationItem({
  icon: Icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:bg-white">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

// ===========================================
// MINI DETAIL
// ===========================================
function MiniDetail({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-teal-600" />
      <span>{text}</span>
    </div>
  );
}