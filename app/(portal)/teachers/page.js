"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Eye,
  GraduationCap,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
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

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  // =========================================
  // LOAD TEACHERS
  // =========================================
  useEffect(() => {
    async function fetchTeachers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/teachers",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load teachers."
          );
        }

        setTeachers(data.teachers || []);
      } catch (error) {
        console.error(
          "Fetch teachers error:",
          error
        );

        setError(
          error.message ||
            "Failed to load teachers."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  // =========================================
  // DELETE TEACHER
  // =========================================
  async function handleDelete(teacher) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${teacher.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(teacher._id);

      const response = await fetch(
        `/api/teachers/${teacher._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete teacher."
        );

        return;
      }

      setTeachers((currentTeachers) =>
        currentTeachers.filter(
          (item) =>
            item._id !== teacher._id
        )
      );
    } catch (error) {
      console.error(
        "Delete teacher error:",
        error
      );

      alert(
        "Something went wrong while deleting the teacher."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================
  // FILTER TEACHERS
  // =========================================
  const filteredTeachers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !searchText ||
        teacher.name
          ?.toLowerCase()
          .includes(searchText) ||
        teacher.employeeId
          ?.toLowerCase()
          .includes(searchText) ||
        teacher.email
          ?.toLowerCase()
          .includes(searchText) ||
        teacher.specialization
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          teacher.isActive) ||
        (statusFilter === "inactive" &&
          !teacher.isActive);

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [teachers, search, statusFilter]);

  // =========================================
  // SUMMARY
  // =========================================
  const activeTeachers = teachers.filter(
    (teacher) => teacher.isActive
  ).length;

  const inactiveTeachers =
    teachers.length - activeTeachers;

  const specializationCount = new Set(
    teachers
      .map((teacher) =>
        teacher.specialization?.trim()
      )
      .filter(Boolean)
  ).size;

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Users className="h-4 w-4" />
            Faculty Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Teachers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Manage teachers, academic
            information and faculty status.
          </p>
        </div>

        <Link
          href="/teachers/add"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </Link>
      </div>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Teachers"
          value={
            loading ? "..." : teachers.length
          }
          icon={Users}
          cardClass="border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50"
          iconClass="bg-teal-100 text-teal-700"
        />

        <SummaryCard
          title="Active Teachers"
          value={
            loading ? "..." : activeTeachers
          }
          icon={UserCheck}
          cardClass="border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50"
          iconClass="bg-emerald-100 text-emerald-700"
        />

        <SummaryCard
          title="Inactive"
          value={
            loading ? "..." : inactiveTeachers
          }
          icon={Users}
          cardClass="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50"
          iconClass="bg-orange-100 text-orange-600"
        />

        <SummaryCard
          title="Specializations"
          value={
            loading
              ? "..."
              : specializationCount
          }
          icon={BookOpen}
          cardClass="border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50"
          iconClass="bg-blue-100 text-blue-700"
        />
      </div>

      {/* =====================================
          SEARCH + FILTER
      ====================================== */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">
              Find Teachers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search faculty members or filter
              them by status.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            {/* SEARCH */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, employee ID, email or specialization..."
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition hover:border-teal-300 focus:bg-white"
              />
            </div>

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          {!loading && !error && (
            <p className="mt-4 text-xs font-medium text-slate-400">
              Showing{" "}
              {filteredTeachers.length} of{" "}
              {teachers.length} teachers
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
          TEACHER DIRECTORY
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Teacher Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registered teaching staff in the
              attendance portal.
            </p>
          </div>

          {!loading && !error && (
            <div className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              {filteredTeachers.length}{" "}
              {filteredTeachers.length === 1
                ? "teacher"
                : "teachers"}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="px-6 font-semibold text-slate-600">
                  Employee ID
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Teacher
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Email
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Specialization
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Status
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
                    colSpan={6}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading teachers...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTeachers.length ===
                0 ? (
                /* EMPTY */
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        No teachers found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {teachers.length === 0
                          ? "No teachers have been registered yet."
                          : "Try changing your search or status filter."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map(
                  (teacher) => (
                    <TableRow
                      key={teacher._id}
                      className="group border-slate-100 transition-colors hover:bg-teal-50/40"
                    >
                      {/* EMPLOYEE ID */}
                      <TableCell className="px-6">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {teacher.employeeId}
                        </span>
                      </TableCell>

                      {/* TEACHER */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold uppercase text-teal-700">
                            {teacher.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "T"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {teacher.name}
                            </p>

                            {teacher.qualification && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  teacher.qualification
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* EMAIL */}
                      <TableCell>
                        {teacher.email ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                            <span className="max-w-[220px] truncate">
                              {teacher.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* SPECIALIZATION */}
                      <TableCell>
                        {teacher.specialization ? (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 shrink-0 text-blue-500" />

                            <span className="text-sm font-medium text-slate-600">
                              {
                                teacher.specialization
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* STATUS */}
                      <TableCell>
                        <Badge
                          className={
                            teacher.isActive
                              ? "border-0 bg-emerald-100 px-2.5 py-1 text-emerald-700 hover:bg-emerald-100"
                              : "border-0 bg-slate-100 px-2.5 py-1 text-slate-600 hover:bg-slate-100"
                          }
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              teacher.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {teacher.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* VIEW */}
                          <Link
                            href={`/teachers/${teacher._id}`}
                            title="View teacher"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {/* EDIT */}
                          <Link
                            href={`/teachers/${teacher._id}/edit`}
                            title="Edit teacher"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {/* DELETE */}
                          <button
                            type="button"
                            title="Delete teacher"
                            onClick={() =>
                              handleDelete(
                                teacher
                              )
                            }
                            disabled={
                              deletingId ===
                              teacher._id
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId ===
                            teacher._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
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