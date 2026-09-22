"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  Clock3,
  Eye,
  GraduationCap,
  Layers3,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  const [search, setSearch] = useState("");

  // =========================================
  // LOAD PAGE
  // =========================================
  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const [
          userResponse,
          classesResponse,
        ] = await Promise.all([
          fetch("/api/auth/me", {
            cache: "no-store",
          }),

          fetch("/api/classes", {
            cache: "no-store",
          }),
        ]);

        const userData =
          await userResponse.json();

        const classesData =
          await classesResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.message ||
              "Failed to load user."
          );
        }

        if (!classesResponse.ok) {
          throw new Error(
            classesData.message ||
              "Failed to load classes."
          );
        }

        setUser(userData.user);

        setClasses(
          classesData.classes || []
        );
      } catch (error) {
        console.error(
          "Load classes page error:",
          error
        );

        setError(
          error.message ||
            "Failed to load classes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  // =========================================
  // DELETE CLASS
  // =========================================
  async function handleDelete(item) {
    if (user?.role !== "admin") {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${item.className} - Section ${item.section}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item._id);

      const response = await fetch(
        `/api/classes/${item._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete class."
        );

        return;
      }

      setClasses((currentClasses) =>
        currentClasses.filter(
          (currentClass) =>
            currentClass._id !== item._id
        )
      );
    } catch (error) {
      console.error(
        "Delete class error:",
        error
      );

      alert(
        "Something went wrong while deleting the class."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================
  // SEARCH
  // =========================================
  const filteredClasses = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return classes;
    }

    return classes.filter((item) => {
      return (
        item.className
          ?.toLowerCase()
          .includes(searchText) ||
        item.section
          ?.toLowerCase()
          .includes(searchText) ||
        item.program?.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.teacher?.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.room
          ?.toLowerCase()
          .includes(searchText) ||
        item.academicYear
          ?.toLowerCase()
          .includes(searchText) ||
        item.time
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [classes, search]);

  // =========================================
  // SUMMARY DATA
  // =========================================
  const sectionCount = new Set(
    classes
      .map((item) =>
        item.section?.trim()
      )
      .filter(Boolean)
  ).size;

  const programCount = new Set(
    classes
      .map((item) => item.program?._id)
      .filter(Boolean)
  ).size;

  const assignedTeacherCount = new Set(
    classes
      .map((item) => item.teacher?._id)
      .filter(Boolean)
  ).size;

  const tableColumnCount =
    user?.role === "admin" ? 8 : 7;

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <GraduationCap className="h-4 w-4" />

            {user?.role === "teacher"
              ? "Teaching Workspace"
              : "Academic Management"}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {user?.role === "teacher"
              ? "My Classes"
              : "Classes"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            {user?.role === "teacher"
              ? "View the classes currently assigned to you."
              : "Manage classes, programs, sections and assigned teachers."}
          </p>
        </div>

        {/* ADMIN ACTIONS */}
        {user?.role === "admin" && (
          <div className="flex flex-wrap gap-3">
            <Link
              href="/classes/assignments"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-100 hover:shadow-md"
            >
              <BookOpenCheck className="h-4 w-4" />
              Assign Subject Teachers
            </Link>

            <Link
              href="/classes/add"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Class
            </Link>
          </div>
        )}
      </div>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title={
            user?.role === "teacher"
              ? "My Classes"
              : "Total Classes"
          }
          value={
            loading ? "..." : classes.length
          }
          icon={Layers3}
          cardClass="border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50"
          iconClass="bg-teal-100 text-teal-700"
        />

        <SummaryCard
          title="Sections"
          value={
            loading ? "..." : sectionCount
          }
          icon={UsersRound}
          cardClass="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50"
          iconClass="bg-orange-100 text-orange-600"
        />

        <SummaryCard
          title="Programs"
          value={
            loading ? "..." : programCount
          }
          icon={GraduationCap}
          cardClass="border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50"
          iconClass="bg-blue-100 text-blue-700"
        />

        <SummaryCard
          title={
            user?.role === "admin"
              ? "Assigned Teachers"
              : "Academic Years"
          }
          value={
            loading
              ? "..."
              : user?.role === "admin"
                ? assignedTeacherCount
                : new Set(
                    classes
                      .map((item) =>
                        item.academicYear?.trim()
                      )
                      .filter(Boolean)
                  ).size
          }
          icon={
            user?.role === "admin"
              ? UserRoundCheck
              : CalendarDays
          }
          cardClass="border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50"
          iconClass="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* =====================================
          SEARCH
      ====================================== */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">
              Find Classes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search by class, section,
              program, room
              {user?.role === "admin"
                ? ", teacher"
                : ""}{" "}
              or academic year.
            </p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search classes..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
            />
          </div>

          {!loading && !error && (
            <p className="mt-4 text-xs font-medium text-slate-400">
              Showing{" "}
              {filteredClasses.length} of{" "}
              {classes.length} classes
            </p>
          )}
        </CardContent>
      </Card>

      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          CLASS DIRECTORY
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {user?.role === "teacher"
                ? "Assigned Classes"
                : "Class Directory"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user?.role === "teacher"
                ? "Classes available under your current teaching assignments."
                : "Classes currently registered in the attendance portal."}
            </p>
          </div>

          {!loading && !error && (
            <div className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              {filteredClasses.length}{" "}
              {filteredClasses.length === 1
                ? "class"
                : "classes"}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="px-6 font-semibold text-slate-600">
                  Class
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Section
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Program
                </TableHead>

                {user?.role === "admin" && (
                  <TableHead className="font-semibold text-slate-600">
                    Class Teacher
                  </TableHead>
                )}

                <TableHead className="font-semibold text-slate-600">
                  Time
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Room
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Academic Year
                </TableHead>

                <TableHead className="pr-6 text-right font-semibold text-slate-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* LOADING */}
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumnCount}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading classes...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredClasses.length ===
                0 ? (
                /* EMPTY */
                <TableRow>
                  <TableCell
                    colSpan={tableColumnCount}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Layers3 className="h-6 w-6" />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        {search
                          ? "No matching classes found"
                          : user?.role ===
                              "teacher"
                            ? "No classes assigned"
                            : "No classes found"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {search
                          ? "Try changing your search."
                          : user?.role ===
                              "teacher"
                            ? "No classes are currently assigned to you."
                            : "No classes have been created yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map(
                  (item) => (
                    <TableRow
                      key={item._id}
                      className="group border-slate-100 transition-colors hover:bg-teal-50/40"
                    >
                      {/* CLASS */}
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                            <GraduationCap className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.className}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Class
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* SECTION */}
                      <TableCell>
                        <Badge className="border-0 bg-orange-100 px-2.5 py-1 text-orange-700 hover:bg-orange-100">
                          Section{" "}
                          {item.section}
                        </Badge>
                      </TableCell>

                      {/* PROGRAM */}
                      <TableCell>
                        {item.program?.name ? (
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <BookOpenCheck className="h-4 w-4 shrink-0 text-blue-500" />

                            <span>
                              {
                                item.program
                                  .name
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* TEACHER */}
                      {user?.role ===
                        "admin" && (
                        <TableCell>
                          {item.teacher?.name ? (
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <UserRoundCheck className="h-4 w-4 shrink-0 text-emerald-500" />

                              <span>
                                {
                                  item.teacher
                                    .name
                                }
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              —
                            </span>
                          )}
                        </TableCell>
                      )}

                      {/* TIME */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock3 className="h-4 w-4 shrink-0 text-slate-400" />

                          <span>
                            {item.time ||
                              "—"}
                          </span>
                        </div>
                      </TableCell>

                      {/* ROOM */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />

                          <span>
                            {item.room ||
                              "—"}
                          </span>
                        </div>
                      </TableCell>

                      {/* ACADEMIC YEAR */}
                      <TableCell>
                        {item.academicYear ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                            <span>
                              {
                                item.academicYear
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* VIEW */}
                          <Link
                            href={`/classes/${item._id}`}
                            title="View class"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {/* ADMIN ONLY */}
                          {user?.role ===
                            "admin" && (
                            <>
                              {/* EDIT */}
                              <Link
                                href={`/classes/${item._id}/edit`}
                                title="Edit class"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>

                              {/* DELETE */}
                              <button
                                type="button"
                                title="Delete class"
                                onClick={() =>
                                  handleDelete(
                                    item
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  item._id
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
                              >
                                {deletingId ===
                                item._id ? (
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

// ===========================================
// SUMMARY CARD
// ===========================================
function SummaryCard({
  title,
  value,
  icon: Icon,
  cardClass,
  iconClass,
}) {
  return (
    <Card
      className={`group rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cardClass}`}
    >
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}