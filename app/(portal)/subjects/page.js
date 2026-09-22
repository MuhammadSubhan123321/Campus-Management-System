"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Pencil,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/subjects");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load subjects."
          );
        }

        setSubjects(data.subjects || []);
      } catch (error) {
        console.error("Fetch subjects error:", error);

        setError(
          error.message || "Failed to load subjects."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  const activeSubjects = subjects.filter(
    (subject) => subject.isActive
  ).length;

  const inactiveSubjects =
    subjects.length - activeSubjects;

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <BookOpen className="h-4 w-4" />
            Academic Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Subjects
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            Manage subjects offered by the school.
          </p>
        </div>

        <Link
          href="/subjects/add"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </Link>
      </div>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={BookOpen}
            label="Total Subjects"
            value={subjects.length}
            color="teal"
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Active Subjects"
            value={activeSubjects}
            color="green"
          />

          <SummaryCard
            icon={FileText}
            label="Inactive Subjects"
            value={inactiveSubjects}
            color="orange"
          />
        </div>
      )}

      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          SUBJECTS TABLE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-600" />

              <h2 className="text-lg font-bold text-slate-900">
                Subject Directory
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all academic subjects.
            </p>
          </div>

          {!loading && !error && subjects.length > 0 && (
            <Badge className="border-0 bg-teal-50 px-3 py-1 font-semibold text-teal-700 hover:bg-teal-50">
              {subjects.length}{" "}
              {subjects.length === 1
                ? "Subject"
                : "Subjects"}
            </Badge>
          )}
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">
                    Subject
                  </th>

                  <th className="px-6 py-4">
                    Code
                  </th>

                  <th className="px-6 py-4">
                    Description
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
                {/* LOADING */}
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

                        <p className="mt-4 text-sm font-medium text-slate-500">
                          Loading subjects...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm font-medium text-red-600"
                    >
                      Unable to load subjects.
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  /* EMPTY STATE */
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        <BookOpen className="h-7 w-7" />
                      </div>

                      <p className="mt-4 font-semibold text-slate-800">
                        No subjects added yet
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Add your first academic subject to
                        get started.
                      </p>

                      <Link
                        href="/subjects/add"
                        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add Subject
                      </Link>
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr
                      key={subject._id}
                      className="border-t border-slate-100 transition-colors hover:bg-teal-50/30"
                    >
                      {/* SUBJECT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                            <BookOpen className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {subject.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Academic Subject
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CODE */}
                      <td className="px-6 py-4">
                        {subject.code ? (
                          <Badge className="border-0 bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-50">
                            {subject.code}
                          </Badge>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* DESCRIPTION */}
                      <td className="max-w-md px-6 py-4">
                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {subject.description ||
                            "No description provided."}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            subject.isActive
                              ? "border-0 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-50"
                              : "border-0 bg-slate-100 px-3 py-1 font-semibold text-slate-500 hover:bg-slate-100"
                          }
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              subject.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {subject.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/subjects/${subject._id}`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 text-xs font-semibold text-teal-700 transition-all hover:border-teal-200 hover:bg-teal-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>

                          <Link
                            href={`/subjects/${subject._id}/edit`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          {!loading &&
            !error &&
            subjects.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <p className="text-xs font-medium text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-700">
                    {subjects.length}
                  </span>{" "}
                  {subjects.length === 1
                    ? "subject"
                    : "subjects"}
                  .
                </p>
              </div>
            )}
        </CardContent>
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
    green:
      "bg-emerald-100 text-emerald-700",
    orange:
      "bg-orange-100 text-orange-700",
  };

  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}