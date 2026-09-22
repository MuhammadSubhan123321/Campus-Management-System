"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleX,
  GraduationCap,
  Hash,
  Mail,
  Pencil,
  Phone,
  School,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id;

  const [student, setStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD STUDENT + ATTENDANCE
  // =========================================
  useEffect(() => {
    async function loadStudentData() {
      try {
        setLoading(true);
        setError("");

        const [
          studentResponse,
          attendanceResponse,
        ] = await Promise.all([
          fetch(`/api/students/${id}`),
          fetch(
            `/api/students/${id}/attendance`
          ),
        ]);

        const studentData =
          await studentResponse.json();

        const attendanceData =
          await attendanceResponse.json();

        if (!studentResponse.ok) {
          throw new Error(
            studentData.message ||
              "Failed to load student."
          );
        }

        if (!attendanceResponse.ok) {
          throw new Error(
            attendanceData.message ||
              "Failed to load attendance history."
          );
        }

        setStudent(studentData.student);

        setAttendanceHistory(
          attendanceData.attendanceHistory || []
        );
      } catch (error) {
        console.error(
          "Load student profile error:",
          error
        );

        setError(
          error.message ||
            "Failed to load student profile."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadStudentData();
    }
  }, [id]);

  // =========================================
  // FORMAT DATE
  // =========================================
  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const [year, month, day] = dateValue
      .split("T")[0]
      .split("-");

    return `${day}/${month}/${year}`;
  }

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading student profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error || !student) {
    return (
      <div className="space-y-5">
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error || "Student not found."}
        </div>
      </div>
    );
  }

  // =========================================
  // ATTENDANCE TOTALS
  // =========================================
  const presentCount = attendanceHistory.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendanceHistory.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalRecords = attendanceHistory.length;

  const attendancePercentage =
    totalRecords > 0
      ? Math.round(
          (presentCount / totalRecords) * 100
        )
      : 0;

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <GraduationCap className="h-4 w-4" />
            Student Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Student Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            View student information and
            subject-wise attendance history.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
        >
          <Link
            href={`/students/${student._id}/edit`}
          >
            <Pencil className="h-4 w-4" />
            Edit Student
          </Link>
        </Button>
      </div>

      {/* =====================================
          PROFILE HERO
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50/60 to-white px-6 py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-2xl font-bold text-teal-700 shadow-sm">
              {student.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {student.name}
                </h2>

                <Badge
                  className={
                    student.isActive !== false
                      ? "border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "border-0 bg-slate-100 text-slate-600 hover:bg-slate-100"
                  }
                >
                  {student.isActive !== false
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-teal-600" />
                  Roll No.{" "}
                  <strong className="font-semibold text-slate-700">
                    {student.rollNumber}
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <School className="h-4 w-4 text-teal-600" />

                  {student.class?.className ||
                    "No class"}

                  {student.class?.section
                    ? ` - Section ${student.class.section}`
                    : ""}
                </span>

                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-teal-600" />

                  {student.class?.program?.name ||
                    "No program"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* =====================================
          INFORMATION
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Information
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Personal and academic details.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
            <InfoItem
              icon={User}
              label="Student Name"
              value={student.name}
            />

            <InfoItem
              icon={Hash}
              label="Roll Number"
              value={student.rollNumber}
            />

            <InfoItem
              icon={School}
              label="Class"
              value={
                student.class?.className ||
                "Not assigned"
              }
            />

            <InfoItem
              icon={BookOpen}
              label="Section"
              value={
                student.class?.section ||
                "Not assigned"
              }
            />

            <InfoItem
              icon={GraduationCap}
              label="Program"
              value={
                student.class?.program?.name ||
                "Not assigned"
              }
            />

            <InfoItem
              icon={Users}
              label="Class Teacher"
              value={
                student.class?.teacher?.name ||
                "Not assigned"
              }
              subValue={
                student.class?.teacher
                  ?.employeeId || ""
              }
            />

            <InfoItem
              icon={User}
              label="Gender"
              value={student.gender || "—"}
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={
                student.phone ||
                "Not provided"
              }
            />

            <InfoItem
              icon={Users}
              label="Guardian Name"
              value={
                student.guardianName ||
                "Not provided"
              }
            />

            <InfoItem
              icon={Phone}
              label="Guardian Phone"
              value={
                student.guardianPhone ||
                "Not provided"
              }
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </p>

              <div className="mt-2">
                <Badge
                  className={
                    student.isActive !== false
                      ? "border-0 bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100"
                      : "border-0 bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-100"
                  }
                >
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />

                  {student.isActive !== false
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          ATTENDANCE SUMMARY
      ====================================== */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Attendance Records"
          value={totalRecords}
          icon={CalendarDays}
          boxClass="bg-sky-50 border-sky-100"
          iconClass="bg-sky-100 text-sky-600"
        />

        <SummaryCard
          title="Present"
          value={presentCount}
          icon={CheckCircle2}
          boxClass="bg-emerald-50 border-emerald-100"
          iconClass="bg-emerald-100 text-emerald-600"
        />

        <SummaryCard
          title="Absent"
          value={absentCount}
          icon={CircleX}
          boxClass="bg-red-50 border-red-100"
          iconClass="bg-red-100 text-red-500"
        />

        <SummaryCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          icon={GraduationCap}
          boxClass="bg-orange-50 border-orange-100"
          iconClass="bg-orange-100 text-orange-600"
        />
      </div>

      {/* =====================================
          ATTENDANCE HISTORY
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Subject Attendance History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See which subjects this student
                attended or missed.
              </p>
            </div>
          </div>
        </div>

        {attendanceHistory.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays className="h-6 w-6" />
            </div>

            <p className="mt-4 font-semibold text-slate-700">
              No attendance records
            </p>

            <p className="mt-1 text-sm text-slate-500">
              No attendance records were found for
              this student.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <TableHeading>
                    Date
                  </TableHeading>

                  <TableHeading>
                    Subject
                  </TableHeading>

                  <TableHeading>
                    Class
                  </TableHeading>

                  <TableHeading>
                    Section
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Action
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {attendanceHistory.map(
                  (record) => (
                    <tr
                      key={
                        record.attendanceId
                      }
                      className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-teal-50/40"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(
                          record.date
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {record.subject
                            ?.name || "—"}
                        </p>

                        {record.subject
                          ?.code && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {
                              record.subject
                                .code
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {record.class
                          ?.className || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {record.class
                          ?.section || "—"}
                      </td>

                      <td className="px-6 py-4">
                        {record.status ===
                        "Present" ? (
                          <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            Present
                          </Badge>
                        ) : record.status ===
                          "Absent" ? (
                          <Badge className="border-0 bg-red-100 text-red-600 hover:bg-red-100">
                            <CircleX className="mr-1 h-3.5 w-3.5" />
                            Absent
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {record.status}
                          </Badge>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/attendance/records/${record.attendanceId}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:gap-2 hover:text-teal-800"
                        >
                          View Record
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// =========================================
// INFO ITEM
// =========================================
function InfoItem({
  icon: Icon,
  label,
  value,
  subValue,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="font-semibold text-slate-800">
            {value}
          </p>

          {subValue && (
            <p className="mt-0.5 text-xs text-slate-400">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================
// SUMMARY CARD
// =========================================
function SummaryCard({
  title,
  value,
  icon: Icon,
  boxClass,
  iconClass,
}) {
  return (
    <Card
      className={`rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${boxClass}`}
    >
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================
// TABLE HEADING
// =========================================
function TableHeading({ children }) {
  return (
    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}