"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  GraduationCap,
  Layers3,
  Pencil,
  School,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PROGRAM
  // =========================================
  useEffect(() => {
    async function fetchProgram() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/programs/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load program."
          );
        }

        setProgram(data.program);
      } catch (error) {
        console.error(
          "Fetch program error:",
          error
        );

        setError(
          error.message ||
            "Failed to load program."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProgram();
    }
  }, [id]);

  // =========================================
  // DELETE PROGRAM
  // =========================================
  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${program.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/programs/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete program."
        );
      }

      router.push("/programs");
      router.refresh();
    } catch (error) {
      console.error(
        "Delete program error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete program."
      );

      setDeleting(false);
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
            Loading program...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR / NOT FOUND
  // =========================================
  if (error && !program) {
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
          {error}
        </div>
      </div>
    );
  }

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
          Program not found.
        </div>
      </div>
    );
  }

  const gradeRange =
    program.gradeFrom === program.gradeTo
      ? `Grade ${program.gradeFrom}`
      : `Grade ${program.gradeFrom} - ${program.gradeTo}`;

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href="/programs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <GraduationCap className="h-4 w-4" />
            Academic Program
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {program.name}
            </h1>

            <Badge
              className={
                program.isActive
                  ? "border-0 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-50"
                  : "border-0 bg-slate-100 px-3 py-1 font-semibold text-slate-500 hover:bg-slate-100"
              }
            >
              <span
                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                  program.isActive
                    ? "bg-emerald-500"
                    : "bg-slate-400"
                }`}
              />

              {program.isActive
                ? "Active"
                : "Inactive"}
            </Badge>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            View and manage academic program
            information, grade coverage and
            subjects.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/programs/${program._id}/subjects`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
          >
            <BookOpen className="h-4 w-4" />
            Manage Subjects
          </Link>

          <Link
            href={`/programs/${program._id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit Program
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition-all hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
          >
            {deleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Program
              </>
            )}
          </button>
        </div>
      </div>

      {/* ERROR AFTER PROGRAM LOADED */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          PROGRAM OVERVIEW
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Program Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Academic structure and education
                details for this program.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard
              icon={BookOpen}
              label="Program Name"
              value={program.name}
              color="teal"
            />

            <InfoCard
              icon={Layers3}
              label="Level"
              value={program.level || "Not specified"}
              color="orange"
            />

            <InfoCard
              icon={GraduationCap}
              label="Grade Range"
              value={gradeRange}
              color="blue"
            />

            <InfoCard
              icon={School}
              label="Education System"
              value={program.system || "Not specified"}
              color="teal"
            />

            <InfoCard
              icon={Layers3}
              label="Group"
              value={program.group || "Not specified"}
              color="orange"
            />

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    program.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <School className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {program.isActive
                      ? "Active Program"
                      : "Inactive Program"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          GRADE COVERAGE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <School className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Grade Coverage
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Grades currently included in this
                academic program.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {Array.from(
              {
                length:
                  Number(program.gradeTo) -
                  Number(program.gradeFrom) +
                  1,
              },
              (_, index) =>
                Number(program.gradeFrom) + index
            ).map((grade) => (
              <div
                key={grade}
                className="flex h-12 min-w-24 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 px-4 text-sm font-bold text-teal-700 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-100"
              >
                Grade {grade}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          DESCRIPTION
      ====================================== */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="font-bold text-slate-900">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {program.description ||
                  "No description provided."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          SUBJECT MANAGEMENT
      ====================================== */}
      <Card className="rounded-2xl border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50/60 shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Program Subjects
              </h3>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Manage which subjects belong to{" "}
                <span className="font-semibold text-slate-700">
                  {program.name}
                </span>
                .
              </p>
            </div>
          </div>

          <Link
            href={`/programs/${program._id}/subjects`}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
          >
            <BookOpen className="h-4 w-4" />
            Manage Subjects
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// ===========================================
// INFORMATION CARD
// ===========================================
function InfoCard({
  icon: Icon,
  label,
  value,
  color = "teal",
}) {
  const colors = {
    teal: "bg-teal-100 text-teal-700",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}