"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] =
    useState("");
  const [selectedSection, setSelectedSection] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] =
    useState(null);

  // =========================================
  // LOAD USER + STUDENTS
  // =========================================
  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const [userResponse, studentsResponse] =
          await Promise.all([
            fetch("/api/auth/me", {
              cache: "no-store",
            }),

            fetch("/api/students", {
              cache: "no-store",
            }),
          ]);

        const userData =
          await userResponse.json();

        const studentsData =
          await studentsResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.message ||
              "Failed to load user."
          );
        }

        if (!studentsResponse.ok) {
          throw new Error(
            studentsData.message ||
              "Failed to load students."
          );
        }

        setUser(userData.user);
        setStudents(
          studentsData.students || []
        );
      } catch (error) {
        console.error(
          "Load students page error:",
          error
        );

        setError(
          error.message ||
            "Failed to load students."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  // =========================================
  // DELETE STUDENT
  // =========================================
  async function handleDelete(student) {
    if (user?.role !== "admin") {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(student._id);

      const response = await fetch(
        `/api/students/${student._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete student."
        );

        return;
      }

      setStudents((currentStudents) =>
        currentStudents.filter(
          (currentStudent) =>
            currentStudent._id !==
            student._id
        )
      );
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      alert(
        "Something went wrong while deleting the student."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================
  // FILTER OPTIONS
  // =========================================
  const classOptions = useMemo(
    () => [
      ...new Set(
        students
          .map(
            (student) =>
              student.class?.className
          )
          .filter(Boolean)
      ),
    ],
    [students]
  );

  const sectionOptions = useMemo(
    () => [
      ...new Set(
        students
          .map(
            (student) =>
              student.class?.section
          )
          .filter(Boolean)
      ),
    ],
    [students]
  );

  // =========================================
  // FILTER STUDENTS
  // =========================================
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        student.name
          ?.toLowerCase()
          .includes(searchText) ||
        student.rollNumber
          ?.toLowerCase()
          .includes(searchText);

      const matchesClass =
        !selectedClass ||
        student.class?.className ===
          selectedClass;

      const matchesSection =
        !selectedSection ||
        student.class?.section ===
          selectedSection;

      return (
        matchesSearch &&
        matchesClass &&
        matchesSection
      );
    });
  }, [
    students,
    search,
    selectedClass,
    selectedSection,
  ]);

  const assignedStudents = students.filter(
    (student) => student.class
  ).length;

  // =========================================
  // UI
  // =========================================
  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Users className="h-4 w-4" />

            {user?.role === "teacher"
              ? "Your Class"
              : "Student Management"}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {user?.role === "teacher"
              ? "My Students"
              : "Students"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            {user?.role === "teacher"
              ? "View students from your assigned classes."
              : "Manage student information, enrollment and class assignments."}
          </p>
        </div>

        {user?.role === "admin" && (
          <Button
            render={
              <Link href="/students/add" />
            }
            className="h-11 rounded-xl bg-teal-600 px-5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      {/* =====================================
          SMALL SUMMARY CARDS
      ====================================== */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Students
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : students.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Assigned to Classes
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : assignedStudents}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =====================================
          FILTERS
      ====================================== */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">
              Find Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search or filter the student
              list.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
            {/* SEARCH */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name or roll number..."
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition focus:bg-white"
              />
            </div>

            {/* CLASS */}
            <select
              value={selectedClass}
              onChange={(event) =>
                setSelectedClass(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              <option value="">
                All Classes
              </option>

              {classOptions.map(
                (className) => (
                  <option
                    key={className}
                    value={className}
                  >
                    {className}
                  </option>
                )
              )}
            </select>

            {/* SECTION */}
            <select
              value={selectedSection}
              onChange={(event) =>
                setSelectedSection(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              <option value="">
                All Sections
              </option>

              {sectionOptions.map(
                (section) => (
                  <option
                    key={section}
                    value={section}
                  >
                    Section {section}
                  </option>
                )
              )}
            </select>
          </div>

          {!loading && (
            <p className="mt-4 text-xs font-medium text-slate-400">
              Showing{" "}
              {filteredStudents.length} of{" "}
              {students.length} students
            </p>
          )}
        </CardContent>
      </Card>

      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          STUDENT TABLE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Student Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user?.role === "teacher"
                ? "Students available from your assigned classes."
                : "All registered students in the portal."}
            </p>
          </div>

          {!loading && (
            <div className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              {filteredStudents.length}{" "}
              {filteredStudents.length === 1
                ? "student"
                : "students"}
            </div>
          )}
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

                <TableHead className="font-semibold text-slate-600">
                  Class
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Section
                </TableHead>

                <TableHead className="pr-6 text-right font-semibold text-slate-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading students...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length ===
                0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        No students found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {user?.role ===
                        "teacher"
                          ? "No students were found in your assigned classes."
                          : "Try changing your search or filters."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map(
                  (student) => (
                    <TableRow
                      key={student._id}
                      className="group transition-colors hover:bg-teal-50/40"
                    >
                      {/* ROLL NUMBER */}
                      <TableCell className="px-6">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {student.rollNumber}
                        </span>
                      </TableCell>

                      {/* NAME */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold uppercase text-teal-700">
                            {student.name
                              ?.charAt(0) ||
                              "S"}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {student.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* CLASS */}
                      <TableCell className="text-slate-600">
                        {student.class
                          ?.className ||
                          "Not assigned"}
                      </TableCell>

                      {/* SECTION */}
                      <TableCell>
                        {student.class
                          ?.section ? (
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Section{" "}
                            {
                              student.class
                                .section
                            }
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/students/${student._id}`}
                            title="View student"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {user?.role ===
                            "admin" && (
                            <>
                              <Link
                                href={`/students/${student._id}/edit`}
                                title="Edit student"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>

                              <button
                                type="button"
                                title="Delete student"
                                onClick={() =>
                                  handleDelete(
                                    student
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  student._id
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {deletingId ===
                                student._id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
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