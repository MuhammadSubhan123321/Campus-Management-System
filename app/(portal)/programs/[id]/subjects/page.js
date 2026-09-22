"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function ProgramSubjectsPage() {
  const params = useParams();
  const id = params.id;

  const [program, setProgram] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [grade, setGrade] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [isCompulsory, setIsCompulsory] =
    useState(true);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] =
    useState(false);
  const [updatingId, setUpdatingId] =
    useState("");
  const [deletingId, setDeletingId] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================
  // LOAD PAGE DATA
  // =========================================
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [
          programResponse,
          subjectsResponse,
          assignmentsResponse,
        ] = await Promise.all([
          fetch(`/api/programs/${id}`),
          fetch("/api/subjects"),
          fetch(
            `/api/program-subjects?programId=${id}`
          ),
        ]);

        const programData =
          await programResponse.json();

        const subjectsData =
          await subjectsResponse.json();

        const assignmentsData =
          await assignmentsResponse.json();

        if (!programResponse.ok) {
          throw new Error(
            programData.message ||
              "Failed to load program."
          );
        }

        if (!subjectsResponse.ok) {
          throw new Error(
            subjectsData.message ||
              "Failed to load subjects."
          );
        }

        if (!assignmentsResponse.ok) {
          throw new Error(
            assignmentsData.message ||
              "Failed to load assigned subjects."
          );
        }

        setProgram(programData.program);
        setSubjects(
          subjectsData.subjects || []
        );
        setAssignments(
          assignmentsData.assignments || []
        );
      } catch (error) {
        console.error(
          "Load program subjects error:",
          error
        );

        setError(
          error.message ||
            "Failed to load program subjects."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  // =========================================
  // REFRESH ASSIGNMENTS
  // =========================================
  async function refreshAssignments() {
    const response = await fetch(
      `/api/program-subjects?programId=${id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to refresh assigned subjects."
      );
    }

    setAssignments(data.assignments || []);
  }

  // =========================================
  // ASSIGN SUBJECT
  // =========================================
  async function handleAssign(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!grade || !subjectId) {
      setError(
        "Please select a grade and subject."
      );
      return;
    }

    try {
      setAssigning(true);

      const response = await fetch(
        "/api/program-subjects",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            programId: id,
            grade: Number(grade),
            subjectId,
            isCompulsory,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to assign subject."
        );
        return;
      }

      await refreshAssignments();

      setSubjectId("");
      setIsCompulsory(true);

      setMessage(
        "Subject assigned successfully."
      );
    } catch (error) {
      console.error(
        "Assign subject error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while assigning subject."
      );
    } finally {
      setAssigning(false);
    }
  }

  // =========================================
  // CHANGE SUBJECT TYPE
  // =========================================
  async function handleChangeType(
    assignment
  ) {
    setError("");
    setMessage("");

    const newValue =
      !assignment.isCompulsory;

    try {
      setUpdatingId(assignment._id);

      const response = await fetch(
        `/api/program-subjects/${assignment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            isCompulsory: newValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update subject assignment."
        );
        return;
      }

      await refreshAssignments();

      setMessage(
        "Subject type updated successfully."
      );
    } catch (error) {
      console.error(
        "Update subject type error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while updating the subject."
      );
    } finally {
      setUpdatingId("");
    }
  }

  // =========================================
  // REMOVE SUBJECT
  // =========================================
  async function handleRemove(assignment) {
    const confirmed = window.confirm(
      `Remove "${assignment.subject?.name}" from Grade ${assignment.grade}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      setDeletingId(assignment._id);

      const response = await fetch(
        `/api/program-subjects/${assignment._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to remove subject assignment."
        );
        return;
      }

      await refreshAssignments();

      setMessage(
        "Subject removed from program successfully."
      );
    } catch (error) {
      console.error(
        "Remove subject error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while removing the subject."
      );
    } finally {
      setDeletingId("");
    }
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
            Loading program subjects...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // PROGRAM NOT FOUND
  // =========================================
  if (!program) {
    return (
      <div className="space-y-5">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programs
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error || "Program not found."}
        </div>
      </div>
    );
  }

  // =========================================
  // GRADES
  // =========================================
  const availableGrades = [];

  for (
    let currentGrade = program.gradeFrom;
    currentGrade <= program.gradeTo;
    currentGrade++
  ) {
    availableGrades.push(currentGrade);
  }

  // Selected grade also acts as table filter,
  // exactly like the original page.
  const visibleAssignments = grade
    ? assignments.filter(
        (assignment) =>
          assignment.grade === Number(grade)
      )
    : assignments;

  const activeSubjects = subjects.filter(
    (subject) => subject.isActive !== false
  );

  const compulsoryCount =
    assignments.filter(
      (assignment) =>
        assignment.isCompulsory
    ).length;

  const electiveCount =
    assignments.filter(
      (assignment) =>
        !assignment.isCompulsory
    ).length;

  const selectClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20";

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href={`/programs/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Program
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <BookOpen className="h-4 w-4" />
          Subject Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Program Subjects
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
          Assign subjects to{" "}
          <span className="font-semibold text-slate-700">
            {program.name}
          </span>{" "}
          by grade and manage whether each
          subject is compulsory or elective.
        </p>
      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={GraduationCap}
          label="Program"
          value={program.name}
          color="teal"
        />

        <SummaryCard
          icon={BookOpen}
          label="Assigned Subjects"
          value={assignments.length}
          color="blue"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Compulsory"
          value={compulsoryCount}
          color="orange"
        />

        <SummaryCard
          icon={BookOpen}
          label="Elective"
          value={electiveCount}
          color="purple"
        />
      </div>

      {/* =====================================
          MESSAGES
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
          ASSIGN SUBJECT
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Plus className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assign Subject
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a grade, subject and
                subject type.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleAssign}>
            <div className="grid gap-5 lg:grid-cols-3">
              {/* GRADE */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  Grade
                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <select
                  value={grade}
                  onChange={(event) => {
                    setGrade(
                      event.target.value
                    );
                    setMessage("");
                  }}
                  className={
                    selectClassName
                  }
                >
                  <option value="">
                    Select Grade
                  </option>

                  {availableGrades.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        Grade {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SUBJECT */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  Subject
                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <select
                  value={subjectId}
                  onChange={(event) =>
                    setSubjectId(
                      event.target.value
                    )
                  }
                  className={
                    selectClassName
                  }
                >
                  <option value="">
                    Select Subject
                  </option>

                  {activeSubjects.map(
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

              {/* TYPE */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-slate-400" />
                  Subject Type
                </Label>

                <select
                  value={
                    isCompulsory
                      ? "true"
                      : "false"
                  }
                  onChange={(event) =>
                    setIsCompulsory(
                      event.target.value ===
                        "true"
                    )
                  }
                  className={
                    selectClassName
                  }
                >
                  <option value="true">
                    Compulsory
                  </option>

                  <option value="false">
                    Elective
                  </option>
                </select>
              </div>
            </div>

            {/* ASSIGN BUTTON */}
            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {grade
                  ? `The table below is currently showing Grade ${grade}.`
                  : "Selecting a grade will also filter the assignments table."}
              </p>

              <button
                type="submit"
                disabled={assigning}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {assigning ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Assign Subject
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* =====================================
          ASSIGNED SUBJECTS
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-600" />

              <h2 className="text-lg font-bold text-slate-900">
                Assigned Subjects
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {grade
                ? `Showing subjects assigned to Grade ${grade}.`
                : "Showing all subjects assigned to this program."}
            </p>
          </div>

          {grade && (
            <button
              type="button"
              onClick={() => {
                setGrade("");
                setMessage("");
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              <RefreshCw className="h-4 w-4" />
              Show All Grades
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">
                  Grade
                </th>

                <th className="px-6 py-4">
                  Subject
                </th>

                <th className="px-6 py-4">
                  Code
                </th>

                <th className="px-6 py-4">
                  Type
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleAssignments.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <BookOpen className="h-6 w-6" />
                    </div>

                    <p className="mt-4 font-semibold text-slate-700">
                      No subjects assigned
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {grade
                        ? `No subjects are assigned to Grade ${grade} yet.`
                        : "Assign a subject using the form above."}
                    </p>
                  </td>
                </tr>
              ) : (
                visibleAssignments.map(
                  (assignment) => (
                    <tr
                      key={assignment._id}
                      className="border-t border-slate-100 transition-colors hover:bg-teal-50/30"
                    >
                      {/* GRADE */}
                      <td className="px-6 py-4">
                        <Badge className="border-0 bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-50">
                          Grade{" "}
                          {assignment.grade}
                        </Badge>
                      </td>

                      {/* SUBJECT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                            <BookOpen className="h-4 w-4" />
                          </div>

                          <span className="font-semibold text-slate-800">
                            {assignment.subject
                              ?.name ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* CODE */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                        {assignment.subject
                          ?.code || "—"}
                      </td>

                      {/* TYPE */}
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            assignment.isCompulsory
                              ? "border-0 bg-orange-50 px-3 py-1 font-semibold text-orange-700 hover:bg-orange-50"
                              : "border-0 bg-purple-50 px-3 py-1 font-semibold text-purple-700 hover:bg-purple-50"
                          }
                        >
                          {assignment.isCompulsory
                            ? "Compulsory"
                            : "Elective"}
                        </Badge>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            assignment.isActive
                              ? "border-0 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-50"
                              : "border-0 bg-slate-100 px-3 py-1 font-semibold text-slate-500 hover:bg-slate-100"
                          }
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              assignment.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {assignment.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleChangeType(
                                assignment
                              )
                            }
                            disabled={
                              updatingId ===
                              assignment._id
                            }
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId ===
                            assignment._id ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
                                Updating
                              </>
                            ) : (
                              <>
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Type
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(
                                assignment
                              )
                            }
                            disabled={
                              deletingId ===
                              assignment._id
                            }
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-all hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            assignment._id ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                Removing
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        {visibleAssignments.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <p className="text-xs font-medium text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {visibleAssignments.length}
              </span>{" "}
              {visibleAssignments.length === 1
                ? "assignment"
                : "assignments"}
              {grade
                ? ` for Grade ${grade}`
                : ""}
              .
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ===========================================
// SUMMARY CARD
// ===========================================
function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}) {
  const colors = {
    teal: "bg-teal-100 text-teal-700",
    blue: "bg-blue-100 text-blue-700",
    orange:
      "bg-orange-100 text-orange-700",
    purple:
      "bg-purple-100 text-purple-700",
  };

  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-lg font-bold text-slate-800">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}