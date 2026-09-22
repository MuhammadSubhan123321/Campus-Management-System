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
  Save,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        setFormData({
          name: data.subject.name || "",
          code: data.subject.code || "",
          description:
            data.subject.description || "",
          isActive:
            data.subject.isActive ?? true,
        });
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

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Subject name is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/subjects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update subject."
        );
        return;
      }

      router.push("/subjects");
      router.refresh();
    } catch (error) {
      console.error(
        "Update subject error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClassName =
    "h-11 rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";

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

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href={`/subjects/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Subject Details
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <BookOpen className="h-4 w-4" />
          Academic Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Edit Subject
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Update subject information and
          availability.
        </p>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* ===================================
            BASIC INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Subject Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the subject&apos;s name
                  and identifying code.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* SUBJECT NAME */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <BookOpen className="h-4 w-4 text-slate-400" />

                  Subject Name

                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Mathematics"
                  className={inputClassName}
                />

                <p className="text-xs leading-5 text-slate-400">
                  The full academic name of the
                  subject.
                </p>
              </div>

              {/* SUBJECT CODE */}
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Hash className="h-4 w-4 text-slate-400" />
                  Subject Code
                </Label>

                <Input
                  id="code"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Example: MATH"
                  className={inputClassName}
                />

                <p className="text-xs leading-5 text-slate-400">
                  Optional short code used to
                  identify this subject.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            DESCRIPTION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/40 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Description
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update additional information
                  about this subject.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-slate-700"
              >
                Subject Description
              </Label>

              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter a short description"
                className="min-h-32 resize-y rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
              />

              <p className="text-xs leading-5 text-slate-400">
                Briefly explain what this subject
                covers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            STATUS
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  formData.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Subject Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Control whether this subject is
                  currently active.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <label
              htmlFor="isActive"
              className={`flex cursor-pointer items-center justify-between gap-5 rounded-2xl border p-5 transition-all ${
                formData.isActive
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {formData.isActive
                    ? "Active Subject"
                    : "Inactive Subject"}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {formData.isActive
                    ? "This subject is currently available in the academic setup."
                    : "This subject is currently marked as inactive."}
                </p>
              </div>

              {/* CUSTOM SWITCH */}
              <div className="relative shrink-0">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="peer sr-only"
                />

                <div className="h-7 w-12 rounded-full bg-slate-300 transition-colors peer-checked:bg-teal-600" />

                <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </CardContent>
        </Card>

        {/* ===================================
            ACTIONS
        ==================================== */}
        <Card className="rounded-2xl border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Save className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Save your changes
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Updated information will be
                  applied to this subject.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/subjects/${id}`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}