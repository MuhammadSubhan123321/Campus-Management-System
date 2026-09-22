"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  Filter,
  GraduationCap,
  Loader2,
  RotateCcw,
  SearchX,
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

export default function ReportsPage() {
  const [records, setRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD REPORT DATA
  // =========================================
  useEffect(() => {
    async function loadReportsData() {
      try {
        setLoading(true);
        setError("");

        const [
          attendanceResponse,
          classesResponse,
          subjectsResponse,
          studentsResponse,
        ] = await Promise.all([
          fetch("/api/attendance"),
          fetch("/api/classes"),
          fetch("/api/subjects"),
          fetch("/api/students"),
        ]);

        const [
          attendanceData,
          classesData,
          subjectsData,
          studentsData,
        ] = await Promise.all([
          attendanceResponse.json(),
          classesResponse.json(),
          subjectsResponse.json(),
          studentsResponse.json(),
        ]);

        if (!attendanceResponse.ok) {
          throw new Error(
            attendanceData.message ||
              "Failed to load attendance."
          );
        }

        if (!classesResponse.ok) {
          throw new Error(
            classesData.message ||
              "Failed to load classes."
          );
        }

        if (!subjectsResponse.ok) {
          throw new Error(
            subjectsData.message ||
              "Failed to load subjects."
          );
        }

        if (!studentsResponse.ok) {
          throw new Error(
            studentsData.message ||
              "Failed to load students."
          );
        }

        setRecords(attendanceData.records || []);
        setClasses(classesData.classes || []);
        setSubjects(subjectsData.subjects || []);
        setStudents(studentsData.students || []);
      } catch (error) {
        console.error("Reports error:", error);

        setError(
          error.message ||
            "Failed to load reports."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReportsData();
  }, []);

  // =========================================
  // FILTER REPORT
  // =========================================
  const reportRows = useMemo(() => {
    const rows = [];

    records.forEach((record) => {
      if (!record.class) {
        return;
      }

      const recordDate = record.date
        ? record.date.split("T")[0]
        : "";

      if (
        selectedClass &&
        record.class._id !== selectedClass
      ) {
        return;
      }

      if (
        selectedSubject &&
        record.subject?._id !== selectedSubject
      ) {
        return;
      }

      if (fromDate && recordDate < fromDate) {
        return;
      }

      if (toDate && recordDate > toDate) {
        return;
      }

      (record.students || []).forEach(
        (item) => {
          if (!item.student) {
            return;
          }

          if (
            selectedStudent &&
            item.student._id !== selectedStudent
          ) {
            return;
          }

          rows.push({
            key: `${record._id}-${item.student._id}`,
            attendanceId: record._id,
            date: record.date,

            studentId: item.student._id,
            studentName: item.student.name,
            rollNumber:
              item.student.rollNumber,

            className:
              record.class.className,
            section: record.class.section,

            subjectName:
              record.subject?.name || "—",

            subjectCode:
              record.subject?.code || "",

            status: item.status,
          });
        }
      );
    });

    return rows;
  }, [
    records,
    selectedClass,
    selectedSubject,
    selectedStudent,
    fromDate,
    toDate,
  ]);

  // =========================================
  // COUNTS
  // =========================================
  const presentCount = reportRows.filter(
    (row) => row.status === "Present"
  ).length;

  const absentCount = reportRows.filter(
    (row) => row.status === "Absent"
  ).length;

  const attendanceRate =
    reportRows.length > 0
      ? Math.round(
          (presentCount /
            reportRows.length) *
            100
        )
      : 0;

  // =========================================
  // HELPERS
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

  function clearFilters() {
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedStudent("");
    setFromDate("");
    setToDate("");
  }

  const hasFilters =
    selectedClass ||
    selectedSubject ||
    selectedStudent ||
    fromDate ||
    toDate;

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <BarChart3 className="h-4 w-4" />
            Analytics & Reports
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Attendance Reports
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Review and filter attendance by
            class, subject, student and date.
          </p>
        </div>

        {hasFilters && (
          <Badge
            variant="outline"
            className="w-fit rounded-lg border-teal-200 bg-teal-50 px-3 py-1.5 font-semibold text-teal-700"
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filters Applied
          </Badge>
        )}
      </div>

      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          FILTERS
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 via-white to-orange-50/70 px-6 py-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Filter className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Report Filters
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Narrow the report to the
                  information you need.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="w-fit rounded-xl border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-40"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {/* CLASS */}
            <FilterField
              label="Class"
              icon={GraduationCap}
            >
              <select
                value={selectedClass}
                onChange={(event) =>
                  setSelectedClass(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">
                  All Classes
                </option>

                {classes.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.className} -{" "}
                    {item.section}
                  </option>
                ))}
              </select>
            </FilterField>

            {/* SUBJECT */}
            <FilterField
              label="Subject"
              icon={ClipboardList}
            >
              <select
                value={selectedSubject}
                onChange={(event) =>
                  setSelectedSubject(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">
                  All Subjects
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name}
                    {subject.code
                      ? ` (${subject.code})`
                      : ""}
                  </option>
                ))}
              </select>
            </FilterField>

            {/* STUDENT */}
            <FilterField
              label="Student"
              icon={UserRound}
            >
              <select
                value={selectedStudent}
                onChange={(event) =>
                  setSelectedStudent(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">
                  All Students
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.name} (
                    {student.rollNumber})
                  </option>
                ))}
              </select>
            </FilterField>

            {/* FROM DATE */}
            <FilterField
              label="From Date"
              icon={CalendarDays}
            >
              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
            </FilterField>

            {/* TO DATE */}
            <FilterField
              label="To Date"
              icon={CalendarDays}
            >
              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </FilterField>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          SUMMARY
      ====================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Attendance Entries"
          value={reportRows.length}
          icon={Users}
          type="total"
        />

        <SummaryCard
          title="Present"
          value={presentCount}
          icon={CheckCircle2}
          type="present"
        />

        <SummaryCard
          title="Absent"
          value={absentCount}
          icon={UserRoundX}
          type="absent"
        />

        <SummaryCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={BarChart3}
          type="rate"
        />
      </div>

      {/* =====================================
          REPORT TABLE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Attendance Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading report..."
                : `${reportRows.length} entr${
                    reportRows.length === 1
                      ? "y"
                      : "ies"
                  } found`}
            </p>
          </div>

          {!loading && (
            <Badge
              variant="outline"
              className="w-fit rounded-lg border-teal-200 bg-teal-50 px-3 py-1 text-teal-700"
            >
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
              {attendanceRate}% Attendance
            </Badge>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">
                  Date
                </th>

                <th className="px-6 py-4">
                  Roll No.
                </th>

                <th className="px-6 py-4">
                  Student
                </th>

                <th className="px-6 py-4">
                  Class
                </th>

                <th className="px-6 py-4">
                  Subject
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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>

                      <p className="font-medium text-slate-700">
                        Loading attendance
                        report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : reportRows.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                        <SearchX className="h-7 w-7" />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No attendance entries
                        found
                      </p>

                      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                        No attendance entries
                        match your current
                        filters. Try changing or
                        clearing them.
                      </p>

                      {hasFilters && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={
                            clearFilters
                          }
                          className="mt-4 rounded-xl"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                reportRows.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-teal-50/30"
                  >
                    {/* DATE */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                      {formatDate(row.date)}
                    </td>

                    {/* ROLL */}
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 font-semibold text-slate-600"
                      >
                        {row.rollNumber}
                      </Badge>
                    </td>

                    {/* STUDENT */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/students/${row.studentId}`}
                        className="group/student flex w-fit items-center gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-700 transition-colors group-hover/student:bg-teal-600 group-hover/student:text-white">
                          {row.studentName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "S"}
                        </div>

                        <span className="font-semibold text-slate-800 transition-colors group-hover/student:text-teal-700">
                          {row.studentName}
                        </span>
                      </Link>
                    </td>

                    {/* CLASS */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="font-medium">
                        {row.className}
                      </span>

                      <span className="text-slate-400">
                        {" "}
                        • {row.section}
                      </span>
                    </td>

                    {/* SUBJECT */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {row.subjectName}
                      </p>

                      {row.subjectCode && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {row.subjectCode}
                        </p>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      {row.status ===
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
                      <Link
                        href={`/attendance/records/${row.attendanceId}`}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 hover:text-teal-800"
                      >
                        <Eye className="h-4 w-4" />
                        View Record
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ===========================================
// FILTER FIELD
// ===========================================
function FilterField({
  label,
  icon: Icon,
  children,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-teal-600" />
        {label}
      </label>

      {children}
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
    total: {
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
    styles[type] || styles.total;

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