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
  CheckCircle2,
  FileText,
  Hash,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/subjects/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load subject."
          );
        }

        setSubject(data.subject);
      } catch (error) {
        console.error(
          "Fetch subject error:",
          error
        );

        setError(
          error.message ||
            "Failed to load subject."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchSubject();
    }
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/subjects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete subject."
        );
      }

      router.push("/subjects");
      router.refresh();
    } catch (error) {
      console.error(
        "Delete subject error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete subject."
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
            Loading subject...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR / NOT FOUND
  // =========================================
  if (error && !subject) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 pb-10">
        <Link
          href="/subjects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 pb-10">
        <Link
          href="/subjects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          Subject not found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href="/subjects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Subjects
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <BookOpen className="h-4 w-4" />
            Subject Details
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {subject.name}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            View academic subject information and
            current status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/subjects/${subject._id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md"
          >
            <Pencil className="h-4 w-4" />
            Edit Subject
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
          >
            {deleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Subject
              </>
            )}
          </button>
        </div>
      </div>

      {/* =====================================
          DELETE / SERVER ERROR
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================
          SUBJECT OVERVIEW
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <BookOpen className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Academic Subject
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {subject.name}
                </h2>
              </div>
            </div>

            <Badge
              className={
                subject.isActive
                  ? "w-fit border-0 bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100"
                  : "w-fit border-0 bg-slate-200 px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-200"
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
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* SUBJECT NAME */}
            <InformationBox
              icon={BookOpen}
              label="Subject Name"
              value={subject.name}
              color="teal"
            />

            {/* SUBJECT CODE */}
            <InformationBox
              icon={Hash}
              label="Subject Code"
              value={
                subject.code || "Not provided"
              }
              color="blue"
            />

            {/* STATUS */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    subject.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {subject.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {subject.isActive
                      ? "This subject is currently available in the academic setup."
                      : "This subject is currently marked as inactive."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          DESCRIPTION
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Subject Description
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Additional information about this
                academic subject.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {subject.description ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {subject.description}
            </p>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-6 text-sm text-slate-400">
              No description provided.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ===========================================
// INFORMATION BOX
// ===========================================
function InformationBox({
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
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition-colors hover:border-teal-100 hover:bg-teal-50/30">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}