"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AttendanceRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/attendance", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load attendance records."
          );
        }

        setRecords(data.records || []);
      } catch (error) {
        console.error("Fetch attendance records error:", error);

        setError(
          error.message || "Failed to load attendance records."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  // --------------------------------
  // CLASS OPTIONS
  // --------------------------------

  const classOptions = useMemo(() => {
    const classMap = new Map();

    records.forEach((record) => {
      if (record.class?._id) {
        classMap.set(record.class._id, record.class);
      }
    });

    return Array.from(classMap.values());
  }, [records]);

  // --------------------------------
  // SUBJECT OPTIONS
  // --------------------------------

  const subjectOptions = useMemo(() => {
    const subjectMap = new Map();

    records.forEach((record) => {
      if (record.subject?._id) {
        subjectMap.set(record.subject._id, record.subject);
      }
    });

    return Array.from(subjectMap.values());
  }, [records]);

  // --------------------------------
  // FILTER RECORDS
  // --------------------------------

  const filteredRecords = records.filter((record) => {
    if (!record.class) {
      return false;
    }

    const recordDate = record.date
      ? record.date.split("T")[0]
      : "";

    const matchesFromDate =
      !fromDate || recordDate >= fromDate;

    const matchesToDate =
      !toDate || recordDate <= toDate;

    const matchesClass =
      !selectedClassId ||
      record.class?._id === selectedClassId;

    const matchesSubject =
      !selectedSubjectId ||
      record.subject?._id === selectedSubjectId;

    return (
      matchesFromDate &&
      matchesToDate &&
      matchesClass &&
      matchesSubject
    );
  });

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
    setFromDate("");
    setToDate("");
    setSelectedClassId("");
    setSelectedSubjectId("");
  }

  return (
    /*
      min-w-0 is important here.
      It allows this page to shrink correctly beside the sidebar.
    */
    <div className="min-w-0 max-w-full overflow-x-hidden">
      {/* ============================== */}
      {/* PAGE HEADER */}
      {/* ============================== */}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Records
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Search and review subject-wise attendance records.
          </p>
        </div>

        <Link
          href="/attendance/mark"
          className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Mark Attendance
        </Link>
      </div>

      {/* ============================== */}
      {/* FILTERS */}
      {/* ============================== */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {/* FROM DATE */}

          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(event.target.value)
              }
              className="h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* TO DATE */}

          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(event.target.value)
              }
              className="h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* CLASS */}

          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Class
            </label>

            <select
              value={selectedClassId}
              onChange={(event) =>
                setSelectedClassId(event.target.value)
              }
              className="h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All Classes</option>

              {classOptions.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.className} - {item.section}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT */}

          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Subject
            </label>

            <select
              value={selectedSubjectId}
              onChange={(event) =>
                setSelectedSubjectId(event.target.value)
              }
              className="h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All Subjects</option>

              {subjectOptions.map((subject) => (
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
          </div>

          {/* CLEAR */}

          <div className="flex min-w-0 items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* ERROR */}
      {/* ============================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ============================== */}
      {/* RECORDS */}
      {/* ============================== */}

      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* RECORD COUNT */}

        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Attendance History
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              {loading
                ? "Loading records..."
                : `${filteredRecords.length} attendance record${
                    filteredRecords.length === 1 ? "" : "s"
                  } found`}
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="w-full">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="w-[10%] px-3 py-3">
                  Date
                </th>

                <th className="w-[11%] px-3 py-3">
                  Class
                </th>

                <th className="w-[7%] px-2 py-3 text-center">
                  Sec.
                </th>

                <th className="w-[13%] px-3 py-3">
                  Subject
                </th>

                <th className="w-[15%] px-3 py-3">
                  Program
                </th>

                <th className="w-[16%] px-3 py-3">
                  Teacher
                </th>

                <th className="w-[8%] px-2 py-3 text-center">
                  Total
                </th>

                <th className="w-[7%] px-2 py-3 text-center">
                  P
                </th>

                <th className="w-[7%] px-2 py-3 text-center">
                  A
                </th>

                <th className="w-[10%] px-2 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Loading attendance records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const presentCount =
                    record.students?.filter(
                      (item) =>
                        item.status === "Present"
                    ).length || 0;

                  const absentCount =
                    record.students?.filter(
                      (item) =>
                        item.status === "Absent"
                    ).length || 0;

                  return (
                    <tr
                      key={record._id}
                      className="border-t border-gray-100 hover:bg-gray-50/70"
                    >
                      {/* DATE */}

                      <td className="px-3 py-3 text-xs text-gray-600">
                        {formatDate(record.date)}
                      </td>

                      {/* CLASS */}

                      <td className="px-3 py-3">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {record.class?.className || "—"}
                        </p>
                      </td>

                      {/* SECTION */}

                      <td className="px-2 py-3 text-center text-sm text-gray-600">
                        {record.class?.section || "—"}
                      </td>

                      {/* SUBJECT */}

                      <td className="px-3 py-3">
                        <p
                          className="truncate font-medium text-gray-900"
                          title={record.subject?.name || ""}
                        >
                          {record.subject?.name || "—"}
                        </p>
                      </td>

                      {/* PROGRAM */}

                      <td className="px-3 py-3">
                        <p
                          className="truncate text-gray-600"
                          title={
                            record.class?.program?.name || ""
                          }
                        >
                          {record.class?.program?.name || "—"}
                        </p>
                      </td>

                      {/* TEACHER */}

                      <td className="px-3 py-3">
                        <p
                          className="truncate text-gray-600"
                          title={
                            record.subjectTeacher?.name || ""
                          }
                        >
                          {record.subjectTeacher?.name || "—"}
                        </p>
                      </td>

                      {/* TOTAL */}

                      <td className="px-2 py-3 text-center font-medium text-gray-700">
                        {record.students?.length || 0}
                      </td>

                      {/* PRESENT */}

                      <td className="px-2 py-3 text-center">
                        <span className="inline-flex min-w-7 justify-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                          {presentCount}
                        </span>
                      </td>

                      {/* ABSENT */}

                      <td className="px-2 py-3 text-center">
                        <span className="inline-flex min-w-7 justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                          {absentCount}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="px-2 py-3 text-right">
                        <Link
                          href={`/attendance/records/${record._id}`}
                          className="whitespace-nowrap text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}