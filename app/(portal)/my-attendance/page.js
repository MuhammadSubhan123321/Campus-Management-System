"use client";

import { useEffect, useState } from "react";

export default function MyAttendancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/student/attendance",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load attendance."
          );
        }

        setData(result);
      } catch (error) {
        console.error(
          "Load my attendance error:",
          error
        );

        setError(
          error.message ||
            "Failed to load attendance."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    return new Date(dateValue).toLocaleDateString(
      "en-GB"
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm">
        Loading attendance...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    student,
    overall,
    subjectSummary,
    history,
  } = data;

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Attendance
        </h1>

        <p className="mt-2 text-gray-600">
          View your attendance summary and
          subject-wise history.
        </p>
      </div>

      {/* STUDENT INFORMATION */}
      <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">
              Student
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {student.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Roll Number
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {student.rollNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Class
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {student.class?.className ||
                "Not assigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Section
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {student.class?.section || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* OVERALL SUMMARY */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Attendance
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {overall.percentage}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {overall.total}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Present
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {overall.present}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Absent
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {overall.absent}
          </p>
        </div>
      </div>

      {/* SUBJECT SUMMARY */}
      <div className="mb-8 rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Subject Attendance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Attendance performance by subject.
          </p>
        </div>

        {subjectSummary.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No subject attendance available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    Subject
                  </th>

                  <th className="px-6 py-3">
                    Total
                  </th>

                  <th className="px-6 py-3">
                    Present
                  </th>

                  <th className="px-6 py-3">
                    Absent
                  </th>

                  <th className="px-6 py-3">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjectSummary.map(
                  (subject) => (
                    <tr
                      key={
                        subject.subjectId ||
                        subject.subjectName
                      }
                      className="border-t"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {subject.subjectName}
                        </p>

                        {subject.subjectCode && (
                          <p className="mt-1 text-sm text-gray-500">
                            {subject.subjectCode}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {subject.total}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {subject.present}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {subject.absent}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {subject.percentage}%
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ATTENDANCE HISTORY */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Attendance History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your recent attendance records.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    Date
                  </th>

                  <th className="px-6 py-3">
                    Subject
                  </th>

                  <th className="px-6 py-3">
                    Class
                  </th>

                  <th className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map(
                  (record, index) => (
                    <tr
                      key={`${record.recordId}-${index}`}
                      className="border-t"
                    >
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(record.date)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {record.subject.name}
                        </p>

                        {record.subject.code && (
                          <p className="mt-1 text-sm text-gray-500">
                            {record.subject.code}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {record.class.name}
                        {record.class.section
                          ? ` - ${record.class.section}`
                          : ""}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            record.status ===
                            "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}