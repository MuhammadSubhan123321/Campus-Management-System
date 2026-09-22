"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Link2,
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

export default function SubjectAssignmentsPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================
  // LOAD DATA
  // =========================================
  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        classesResponse,
        subjectsResponse,
        teachersResponse,
        assignmentsResponse,
      ] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/subjects"),
        fetch("/api/teachers"),
        fetch("/api/subject-assignments"),
      ]);

      const [
        classesData,
        subjectsData,
        teachersData,
        assignmentsData,
      ] = await Promise.all([
        classesResponse.json(),
        subjectsResponse.json(),
        teachersResponse.json(),
        assignmentsResponse.json(),
      ]);

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

      if (!teachersResponse.ok) {
        throw new Error(
          teachersData.message ||
            "Failed to load teachers."
        );
      }

      if (!assignmentsResponse.ok) {
        throw new Error(
          assignmentsData.message ||
            "Failed to load assignments."
        );
      }

      setClasses(classesData.classes || []);

      setSubjects(
        (subjectsData.subjects || []).filter(
          (subject) => subject.isActive !== false
        )
      );

      setTeachers(
        (teachersData.teachers || []).filter(
          (teacher) => teacher.isActive !== false
        )
      );

      setAssignments(
        assignmentsData.assignments || []
      );
    } catch (error) {
      console.error(
        "Load subject assignments error:",
        error
      );

      setError(
        error.message ||
          "Failed to load subject assignments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // =========================================
  // SAVE ASSIGNMENT
  // =========================================
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!classId || !subjectId || !teacherId) {
      setError(
        "Please select a class, subject and teacher."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/subject-assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId,
            subjectId,
            teacherId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to save assignment."
        );
        return;
      }

      setMessage(
        "Subject teacher assigned successfully."
      );

      setClassId("");
      setSubjectId("");
      setTeacherId("");

      await loadData();
    } catch (error) {
      console.error(
        "Save subject assignment error:",
        error
      );

      setError(
        "Something went wrong while saving the assignment."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedClass = classes.find(
    (item) => item._id === classId
  );

  const selectedSubject = subjects.find(
    (item) => item._id === subjectId
  );

  const selectedTeacher = teachers.find(
    (item) => item._id === teacherId
  );

  const selectClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Link2 className="h-4 w-4" />
            Academic Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Subject Assignments
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Connect each class and subject with the
            teacher responsible for teaching it.
          </p>
        </div>

        <Badge className="w-fit border-0 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">
          {assignments.length}{" "}
          {assignments.length === 1
            ? "Assignment"
            : "Assignments"}
        </Badge>
      </div>

      {/* =====================================
          ERROR / SUCCESS
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {message}
        </div>
      )}

      {/* =====================================
          ASSIGNMENT FORM
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
              <UserRoundCheck className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assign Subject Teacher
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a class, subject and teacher
                to create an academic assignment.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-3"
          >
            {/* CLASS */}
            <AssignmentField
              icon={GraduationCap}
              label="Class"
              number="1"
            >
              <select
                value={classId}
                onChange={(event) =>
                  setClassId(event.target.value)
                }
                disabled={loading}
                className={selectClassName}
              >
                <option value="">
                  Select Class
                </option>

                {classes.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.className} - Section{" "}
                    {item.section}
                  </option>
                ))}
              </select>
            </AssignmentField>

            {/* SUBJECT */}
            <AssignmentField
              icon={BookOpen}
              label="Subject"
              number="2"
            >
              <select
                value={subjectId}
                onChange={(event) =>
                  setSubjectId(event.target.value)
                }
                disabled={loading}
                className={selectClassName}
              >
                <option value="">
                  Select Subject
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
            </AssignmentField>

            {/* TEACHER */}
            <AssignmentField
              icon={UsersRound}
              label="Teacher"
              number="3"
            >
              <select
                value={teacherId}
                onChange={(event) =>
                  setTeacherId(event.target.value)
                }
                disabled={loading}
                className={selectClassName}
              >
                <option value="">
                  Select Teacher
                </option>

                {teachers.map((teacher) => (
                  <option
                    key={teacher._id}
                    value={teacher._id}
                  >
                    {teacher.name}
                    {teacher.employeeId
                      ? ` (${teacher.employeeId})`
                      : ""}
                  </option>
                ))}
              </select>
            </AssignmentField>

            {/* PREVIEW + BUTTON */}
            <div className="lg:col-span-3">
              <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Assignment Preview
                  </p>

                  {selectedClass ||
                  selectedSubject ||
                  selectedTeacher ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <PreviewBadge
                        icon={GraduationCap}
                        text={
                          selectedClass
                            ? `${selectedClass.className} - ${selectedClass.section}`
                            : "Select class"
                        }
                      />

                      <span className="text-slate-300">
                        →
                      </span>

                      <PreviewBadge
                        icon={BookOpen}
                        text={
                          selectedSubject
                            ? selectedSubject.name
                            : "Select subject"
                        }
                      />

                      <span className="text-slate-300">
                        →
                      </span>

                      <PreviewBadge
                        icon={UserRoundCheck}
                        text={
                          selectedTeacher
                            ? selectedTeacher.name
                            : "Select teacher"
                        }
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">
                      Select the three fields above
                      to preview the assignment.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving || loading}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" />
                      Assign Teacher
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* =====================================
          CURRENT ASSIGNMENTS
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-orange-600" />

              <h2 className="text-lg font-bold text-slate-900">
                Current Assignments
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Teachers currently assigned to class
              subjects.
            </p>
          </div>

          <Badge className="w-fit border-0 bg-orange-50 px-3 py-1.5 text-orange-700 hover:bg-orange-50">
            {assignments.length} Total
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="px-6 font-semibold text-slate-600">
                  Class
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Subject
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Teacher
                </TableHead>

                <TableHead className="pr-6 font-semibold text-slate-600">
                  Employee ID
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

                      <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading assignments...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Link2 className="h-6 w-6" />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        No assignments yet
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Create your first subject
                        teacher assignment above.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow
                    key={assignment._id}
                    className="border-slate-100 transition-colors hover:bg-teal-50/40"
                  >
                    {/* CLASS */}
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <GraduationCap className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {assignment.class
                              ?.className || "—"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Section{" "}
                            {assignment.class
                              ?.section || "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* SUBJECT */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-orange-500" />

                        <span className="font-medium text-slate-700">
                          {assignment.subject
                            ?.name || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* TEACHER */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                          {assignment.teacher?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "T"}
                        </div>

                        <span className="font-semibold text-slate-700">
                          {assignment.teacher
                            ?.name || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* EMPLOYEE ID */}
                    <TableCell className="pr-6">
                      <Badge className="border-0 bg-slate-100 font-medium text-slate-600 hover:bg-slate-100">
                        {assignment.teacher
                          ?.employeeId || "—"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ===========================================
// ASSIGNMENT FIELD
// ===========================================
function AssignmentField({
  icon: Icon,
  label,
  number,
  children,
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Icon className="h-4 w-4 text-slate-400" />
          {label}
        </label>

        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal-700">
          {number}
        </span>
      </div>

      {children}
    </div>
  );
}

// ===========================================
// PREVIEW BADGE
// ===========================================
function PreviewBadge({
  icon: Icon,
  text,
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600">
      <Icon className="h-3.5 w-3.5 text-teal-600" />
      {text}
    </div>
  );
}