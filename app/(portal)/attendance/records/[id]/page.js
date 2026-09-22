"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  DoorOpen,
  Eye,
  GraduationCap,
  Loader2,
  School,
  UserCheck,
  UserRound,
  UserRoundX,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AttendanceRecordDetailPage() {
  const params = useParams();
  const id = params.id;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH ATTENDANCE RECORD
  // =========================================
  useEffect(() => {
    async function fetchRecord() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/attendance/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load attendance record."
          );
        }

        setRecord(data.attendance);
      } catch (error) {
        console.error(
          "Fetch attendance record error:",
          error
        );

        setError(
          error.message ||
            "Failed to load attendance record."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRecord();
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
            <Loader2 className="h-7 w-7 animate-spin text-teal-600" />
          </div>

          <p className="font-medium text-slate-700">
            Loading attendance record...
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <Button
          asChild
          variant="ghost"
          className="mb-5 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700"
        >
          <Link href="/attendance/records">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Attendance Records
          </Link>
        </Button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  // =========================================
  // COUNTS
  // =========================================
  const totalStudents =
    record.students?.length || 0;

  const presentStudents =
    record.students?.filter(
      (item) => item.status === "Present"
    ).length || 0;

  const absentStudents =
    record.students?.filter(
      (item) => item.status === "Absent"
    ).length || 0;

  const attendancePercentage =
    totalStudents > 0
      ? Math.round(
          (presentStudents / totalStudents) * 100
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* =====================================
          BACK BUTTON
      ====================================== */}
      <Button
        asChild
        variant="ghost"
        className="-ml-3 w-fit rounded-xl text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
      >
        <Link href="/attendance/records">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendance Records
        </Link>
      </Button>

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <ClipboardCheck className="h-4 w-4" />
            Attendance Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Attendance Record
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Review student attendance for this
            class and subject session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-0 bg-teal-100 px-3 py-1.5 font-semibold text-teal-700 hover:bg-teal-100">
            {record.class?.className || "Class"}{" "}
            {record.class?.section
              ? `• Section ${record.class.section}`
              : ""}
          </Badge>

          <Badge className="border-0 bg-orange-100 px-3 py-1.5 font-semibold text-orange-700 hover:bg-orange-100">
            {record.subject?.name || "Subject"}
          </Badge>
        </div>
      </div>

      {/* =====================================
          RECORD INFORMATION
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 via-white to-orange-50/70 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <School className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Record Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Academic and session details for
                this attendance record.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              icon={GraduationCap}
              label="Class"
              value={
                record.class?.className || "—"
              }
              type="teal"
            />

            <InfoItem
              icon={School}
              label="Section"
              value={record.class?.section || "—"}
              type="orange"
            />

            <InfoItem
              icon={GraduationCap}
              label="Program"
              value={
                record.class?.program?.name ||
                "—"
              }
              type="teal"
            />

            <InfoItem
              icon={BookOpen}
              label="Subject"
              value={record.subject?.name || "—"}
              secondary={record.subject?.code}
              type="orange"
            />

            <InfoItem
              icon={UserRound}
              label="Subject Teacher"
              value={
                record.subjectTeacher?.name ||
                "—"
              }
              secondary={
                record.subjectTeacher?.employeeId
              }
              type="teal"
            />

            <InfoItem
              icon={CalendarDays}
              label="Date"
              value={formatDate(record.date)}
              type="orange"
            />

            <InfoItem
              icon={DoorOpen}
              label="Room"
              value={record.class?.room || "—"}
              type="teal"
            />

            <InfoItem
              icon={CalendarDays}
              label="Academic Year"
              value={
                record.class?.academicYear || "—"
              }
              type="orange"
            />
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          SUMMARY
      ====================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          type="students"
        />

        <SummaryCard
          title="Present"
          value={presentStudents}
          icon={UserCheck}
          type="present"
        />

        <SummaryCard
          title="Absent"
          value={absentStudents}
          icon={UserRoundX}
          type="absent"
        />

        <SummaryCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          icon={CheckCircle2}
          type="rate"
        />
      </div>

      {/* =====================================
          STUDENT ATTENDANCE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Student Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Present or absent status for every
              student in this subject session.
            </p>
          </div>

          <Badge
            variant="outline"
            className="w-fit rounded-lg border-teal-200 bg-teal-50 px-3 py-1 text-teal-700"
          >
            <Users className="mr-1.5 h-3.5 w-3.5" />
            {totalStudents}{" "}
            {totalStudents === 1
              ? "Student"
              : "Students"}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">
                  Roll No.
                </th>

                <th className="px-6 py-4">
                  Student Name
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {!record.students ||
              record.students.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-16"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Users className="h-7 w-7" />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No student attendance found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        There are no student
                        attendance entries in this
                        record.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                record.students.map(
                  (item, index) => (
                    <tr
                      key={
                        item.student?._id ||
                        `student-${index}`
                      }
                      className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-teal-50/30"
                    >
                      {/* ROLL NUMBER */}
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 font-semibold text-slate-600"
                        >
                          {item.student
                            ?.rollNumber || "—"}
                        </Badge>
                      </td>

                      {/* STUDENT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-700">
                            {item.student?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "S"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.student
                                ?.name ||
                                "Unknown Student"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Student
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        {item.status ===
                        "Present" ? (
                          <Badge className="border-0 bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-100">
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            Present
                          </Badge>
                        ) : (
                          <Badge className="border-0 bg-red-100 px-3 py-1 font-semibold text-red-700 hover:bg-red-100">
                            <UserRoundX className="mr-1.5 h-3.5 w-3.5" />
                            Absent
                          </Badge>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        {item.student?._id ? (
                          <Link
                            href={`/students/${item.student._id}`}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 hover:text-teal-800"
                          >
                            <Eye className="h-4 w-4" />
                            View Student
                          </Link>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ===========================================
// INFO ITEM
// ===========================================
function InfoItem({
  icon: Icon,
  label,
  value,
  secondary,
  type = "teal",
}) {
  const iconStyle =
    type === "orange"
      ? "bg-orange-100 text-orange-700"
      : "bg-teal-100 text-teal-700";

  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-slate-800">
          {value}
        </p>

        {secondary && (
          <p className="mt-0.5 text-xs text-slate-400">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}

// ===========================================
// SUMMARY CARD
// ===========================================
function SummaryCard({
  title,
  value,
  icon: Icon,
  type,
}) {
  const styles = {
    students: {
      card: "hover:border-teal-200 hover:bg-teal-50/30",
      icon: "bg-teal-100 text-teal-700",
      value: "text-slate-900",
    },

    present: {
      card: "hover:border-emerald-200 hover:bg-emerald-50/30",
      icon: "bg-emerald-100 text-emerald-700",
      value: "text-emerald-700",
    },

    absent: {
      card: "hover:border-red-200 hover:bg-red-50/30",
      icon: "bg-red-100 text-red-700",
      value: "text-red-700",
    },

    rate: {
      card: "hover:border-orange-200 hover:bg-orange-50/30",
      icon: "bg-orange-100 text-orange-700",
      value: "text-orange-700",
    },
  };

  const current =
    styles[type] || styles.students;

  return (
    <Card
      className={`rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${current.card}`}
    >
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${current.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${current.icon}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}