"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Loader2,
  Save,
  UserCheck,
  UserRoundX,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function MarkAttendancePage() {
  const [assignments, setAssignments] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [selectedClassId, setSelectedClassId] =
    useState("");
  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");
  const [date, setDate] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [loadingData, setLoadingData] =
    useState(true);
  const [loadingStudents, setLoadingStudents] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================
  // LOAD ASSIGNMENTS + STUDENTS
  // =========================================
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoadingData(true);
        setError("");

        const [
          assignmentsResponse,
          studentsResponse,
        ] = await Promise.all([
          fetch("/api/subject-assignments", {
            cache: "no-store",
          }),

          fetch("/api/students", {
            cache: "no-store",
          }),
        ]);

        const assignmentsData =
          await assignmentsResponse.json();

        const studentsData =
          await studentsResponse.json();

        if (!assignmentsResponse.ok) {
          throw new Error(
            assignmentsData.message ||
              "Failed to load subject assignments."
          );
        }

        if (!studentsResponse.ok) {
          throw new Error(
            studentsData.message ||
              "Failed to load students."
          );
        }

        const validAssignments = (
          assignmentsData.assignments || []
        ).filter(
          (assignment) =>
            assignment.isActive !== false &&
            assignment.class &&
            assignment.subject
        );

        setAssignments(validAssignments);

        setAllStudents(
          studentsData.students || []
        );
      } catch (error) {
        console.error(
          "Load attendance data error:",
          error
        );

        setError(
          error.message ||
            "Failed to load attendance data."
        );
      } finally {
        setLoadingData(false);
      }
    }

    fetchInitialData();
  }, []);

  // =========================================
  // RESET LOADED STUDENTS
  // =========================================
  function resetLoadedStudents() {
    setStudents([]);
    setAttendance({});
    setError("");
    setMessage("");
  }

  // =========================================
  // AVAILABLE CLASSES
  // =========================================
  const availableClasses = [];

  assignments.forEach((assignment) => {
    const classItem = assignment.class;

    if (!classItem?._id) {
      return;
    }

    const alreadyAdded = availableClasses.some(
      (item) => item._id === classItem._id
    );

    if (!alreadyAdded) {
      availableClasses.push(classItem);
    }
  });

  // =========================================
  // SUBJECTS FOR SELECTED CLASS
  // =========================================
  const availableSubjects = assignments
    .filter(
      (assignment) =>
        assignment.class?._id ===
        selectedClassId
    )
    .map((assignment) => assignment.subject)
    .filter(Boolean);

  // =========================================
  // SELECTED ASSIGNMENT
  // =========================================
  const selectedAssignment =
    assignments.find(
      (assignment) =>
        assignment.class?._id ===
          selectedClassId &&
        assignment.subject?._id ===
          selectedSubjectId
    );

  const selectedClass =
    selectedAssignment?.class ||
    availableClasses.find(
      (item) => item._id === selectedClassId
    );

  const selectedSubject =
    selectedAssignment?.subject ||
    availableSubjects.find(
      (item) => item._id === selectedSubjectId
    );

  // =========================================
  // CLASS CHANGE
  // =========================================
  function handleClassChange(event) {
    const classId = event.target.value;

    setSelectedClassId(classId);
    setSelectedSubjectId("");

    resetLoadedStudents();
  }

  // =========================================
  // SUBJECT CHANGE
  // =========================================
  function handleSubjectChange(event) {
    setSelectedSubjectId(event.target.value);

    resetLoadedStudents();
  }

  // =========================================
  // LOAD STUDENTS
  // =========================================
  function handleLoadStudents() {
    setError("");
    setMessage("");

    if (!selectedClassId) {
      setError("Please select a class.");
      return;
    }

    if (!selectedSubjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const assignmentExists =
      assignments.some(
        (assignment) =>
          assignment.class?._id ===
            selectedClassId &&
          assignment.subject?._id ===
            selectedSubjectId
      );

    if (!assignmentExists) {
      setError(
        "You are not assigned to this class and subject."
      );
      return;
    }

    try {
      setLoadingStudents(true);

      const matchingStudents =
        allStudents.filter((student) => {
          const studentClassId =
            typeof student.class === "object"
              ? student.class?._id
              : student.class;

          return (
            studentClassId ===
              selectedClassId &&
            student.isActive !== false
          );
        });

      setStudents(matchingStudents);

      const initialAttendance = {};

      matchingStudents.forEach((student) => {
        initialAttendance[student._id] = "";
      });

      setAttendance(initialAttendance);

      if (matchingStudents.length === 0) {
        setError(
          "No active students are enrolled in this class."
        );
      }
    } finally {
      setLoadingStudents(false);
    }
  }

  // =========================================
  // CHANGE ONE STUDENT
  // =========================================
  function handleAttendanceChange(
    studentId,
    status
  ) {
    setAttendance((previousAttendance) => ({
      ...previousAttendance,
      [studentId]: status,
    }));

    setError("");
  }

  // =========================================
  // MARK EVERYONE
  // =========================================
  function markAll(status) {
    const updatedAttendance = {};

    students.forEach((student) => {
      updatedAttendance[student._id] =
        status;
    });

    setAttendance(updatedAttendance);
    setError("");
  }

  // =========================================
  // SUBMIT
  // =========================================
  async function handleSubmit() {
    setError("");
    setMessage("");

    if (
      !selectedClassId ||
      !selectedSubjectId ||
      !date
    ) {
      setError(
        "Please select a class, subject and date."
      );
      return;
    }

    const assignmentExists =
      assignments.some(
        (assignment) =>
          assignment.class?._id ===
            selectedClassId &&
          assignment.subject?._id ===
            selectedSubjectId
      );

    if (!assignmentExists) {
      setError(
        "You are not assigned to this class and subject."
      );
      return;
    }

    if (students.length === 0) {
      setError(
        "There are no students to submit."
      );
      return;
    }

    const unmarkedStudent = students.find(
      (student) => !attendance[student._id]
    );

    if (unmarkedStudent) {
      setError(
        `Please mark attendance for ${unmarkedStudent.name}.`
      );
      return;
    }

    const studentAttendance = students.map(
      (student) => ({
        student: student._id,
        status: attendance[student._id],
      })
    );

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/attendance",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            classId: selectedClassId,
            subjectId: selectedSubjectId,
            date,
            students: studentAttendance,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to save attendance."
        );
        return;
      }

      setMessage(
        "Attendance saved successfully."
      );

      setStudents([]);
      setAttendance({});
      setSelectedClassId("");
      setSelectedSubjectId("");
      setDate("");
    } catch (error) {
      console.error(
        "Submit attendance error:",
        error
      );

      setError(
        "Something went wrong while saving attendance."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================
  // COUNTS
  // =========================================
  const presentCount = students.filter(
    (student) =>
      attendance[student._id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) =>
      attendance[student._id] === "Absent"
  ).length;

  const unmarkedCount =
    students.length -
    presentCount -
    absentCount;

  // =========================================
  // UI
  // =========================================
  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <ClipboardCheck className="h-4 w-4" />
          Attendance Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Mark Attendance
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Select an assigned class and subject,
          load the students, and record their
          attendance.
        </p>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {/* =====================================
          SUCCESS
      ====================================== */}
      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          {message}
        </div>
      )}

      {/* =====================================
          ATTENDANCE SETUP CARD
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Attendance Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose the class, subject and
                attendance date.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-3">
            {/* CLASS */}
            <div className="space-y-2">
              <Label
                htmlFor="attendance-class"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <GraduationCap className="h-4 w-4 text-teal-600" />
                Class
              </Label>

              <select
                id="attendance-class"
                value={selectedClassId}
                onChange={handleClassChange}
                disabled={loadingData}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {loadingData
                    ? "Loading classes..."
                    : availableClasses.length ===
                      0
                    ? "No Assigned Classes"
                    : "Select Class"}
                </option>

                {availableClasses.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.className} - Section{" "}
                      {item.section}
                      {item.program?.name
                        ? ` | ${item.program.name}`
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SUBJECT */}
            <div className="space-y-2">
              <Label
                htmlFor="attendance-subject"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <BookOpen className="h-4 w-4 text-orange-500" />
                Subject
              </Label>

              <select
                id="attendance-subject"
                value={selectedSubjectId}
                onChange={handleSubjectChange}
                disabled={
                  loadingData ||
                  !selectedClassId
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {!selectedClassId
                    ? "Select Class First"
                    : availableSubjects.length ===
                      0
                    ? "No Assigned Subjects"
                    : "Select Subject"}
                </option>

                {availableSubjects.map(
                  (subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                    >
                      {subject.name}
                      {subject.code
                        ? ` (${subject.code})`
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <Label
                htmlFor="attendance-date"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <CalendarDays className="h-4 w-4 text-blue-500" />
                Date
              </Label>

              <input
                id="attendance-date"
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  resetLoadedStudents();
                }}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* LOAD BUTTON */}
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={handleLoadStudents}
              disabled={
                loadingData ||
                loadingStudents ||
                !selectedClassId ||
                !selectedSubjectId ||
                !date
              }
              className="h-11 rounded-xl bg-teal-600 px-6 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
            >
              {loadingStudents ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Students...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Load Students
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          STUDENTS
      ====================================== */}
      {students.length > 0 &&
        selectedClass &&
        selectedSubject && (
          <>
            {/* SUMMARY */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                title="Total Students"
                value={students.length}
                icon={Users}
                type="total"
              />

              <SummaryCard
                title="Present"
                value={presentCount}
                icon={UserCheck}
                type="present"
              />

              <SummaryCard
                title="Absent"
                value={absentCount}
                icon={UserRoundX}
                type="absent"
              />

              <SummaryCard
                title="Unmarked"
                value={unmarkedCount}
                icon={ClipboardCheck}
                type="unmarked"
              />
            </div>

            {/* =================================
                STUDENT ATTENDANCE CARD
            ================================== */}
            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
              {/* HEADER */}
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">
                        {
                          selectedClass.className
                        }{" "}
                        - Section{" "}
                        {selectedClass.section}
                      </h2>

                      <Badge className="border-0 bg-teal-100 font-semibold text-teal-700 hover:bg-teal-100">
                        {selectedSubject.name}
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      {selectedSubject.code && (
                        <span>
                          Subject Code:{" "}
                          <strong className="font-semibold text-slate-700">
                            {
                              selectedSubject.code
                            }
                          </strong>
                        </span>
                      )}

                      {selectedClass.program
                        ?.name && (
                        <span>
                          Program:{" "}
                          <strong className="font-semibold text-slate-700">
                            {
                              selectedClass
                                .program.name
                            }
                          </strong>
                        </span>
                      )}

                      {selectedAssignment
                        ?.teacher?.name && (
                        <span>
                          Subject Teacher:{" "}
                          <strong className="font-semibold text-slate-700">
                            {
                              selectedAssignment
                                .teacher.name
                            }
                          </strong>
                        </span>
                      )}

                      <span>
                        Date:{" "}
                        <strong className="font-semibold text-slate-700">
                          {date}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* MARK ALL */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        markAll("Present")
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      Mark All Present
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        markAll("Absent")
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-sm"
                    >
                      <UserRoundX className="h-4 w-4" />
                      Mark All Absent
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">
                        Roll No.
                      </th>

                      <th className="px-6 py-4">
                        Student
                      </th>

                      <th className="px-6 py-4">
                        Attendance
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map(
                      (student) => {
                        const status =
                          attendance[
                            student._id
                          ];

                        return (
                          <tr
                            key={student._id}
                            className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-teal-50/30"
                          >
                            {/* ROLL */}
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
                                {
                                  student.rollNumber
                                }
                              </span>
                            </td>

                            {/* STUDENT */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-sm font-bold text-teal-700">
                                  {student.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "S"}
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {
                                      student.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    Student
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* ATTENDANCE */}
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {/* PRESENT */}
                                <label
                                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                                    status ===
                                    "Present"
                                      ? "border-emerald-300 bg-emerald-100 text-emerald-700 shadow-sm"
                                      : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`attendance-${student._id}`}
                                    checked={
                                      status ===
                                      "Present"
                                    }
                                    onChange={() =>
                                      handleAttendanceChange(
                                        student._id,
                                        "Present"
                                      )
                                    }
                                    className="sr-only"
                                  />

                                  <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                      status ===
                                      "Present"
                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    {status ===
                                      "Present" && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>

                                  Present
                                </label>

                                {/* ABSENT */}
                                <label
                                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                                    status ===
                                    "Absent"
                                      ? "border-red-300 bg-red-100 text-red-700 shadow-sm"
                                      : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`attendance-${student._id}`}
                                    checked={
                                      status ===
                                      "Absent"
                                    }
                                    onChange={() =>
                                      handleAttendanceChange(
                                        student._id,
                                        "Absent"
                                      )
                                    }
                                    className="sr-only"
                                  />

                                  <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                      status ===
                                      "Absent"
                                        ? "border-red-600 bg-red-600 text-white"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    {status ===
                                      "Absent" && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>

                                  Absent
                                </label>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================
                  FOOTER
              ================================== */}
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {unmarkedCount > 0 ? (
                      <>
                        <p className="text-sm font-semibold text-orange-700">
                          {unmarkedCount}{" "}
                          {unmarkedCount === 1
                            ? "student is"
                            : "students are"}{" "}
                          still unmarked.
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Mark every student before
                          submitting attendance.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Attendance complete
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Every student has been
                          marked.
                        </p>
                      </>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      submitting ||
                      unmarkedCount > 0
                    }
                    className="h-11 rounded-xl bg-teal-600 px-6 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Submit Attendance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
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

    unmarked: {
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