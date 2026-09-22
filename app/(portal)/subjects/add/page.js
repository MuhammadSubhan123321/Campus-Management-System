"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Hash,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddSubjectPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
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
      setLoading(true);

      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to add subject."
        );
        return;
      }

      router.push("/subjects");
      router.refresh();
    } catch (error) {
      console.error("Add subject error:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "h-11 rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* BACK */}
      <Link
        href="/subjects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Subjects
      </Link>

      {/* HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <BookOpen className="h-4 w-4" />
          Academic Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Add Subject
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Add a new subject to the school&apos;s
          academic setup.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* SUBJECT INFORMATION */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          {/* CARD HEADER */}
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
                  Enter the basic details for the
                  academic subject.
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
                  Enter the full academic subject
                  name.
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
                  identify the subject.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
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
                  Add optional information about
                  this subject.
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
                placeholder="Enter a short description (optional)"
                className="min-h-32 resize-y rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
              />

              <p className="text-xs leading-5 text-slate-400">
                You can briefly explain what this
                subject covers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* BOTTOM ACTION AREA */}
        <Card className="rounded-2xl border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Plus className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Create new subject
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The subject can later be assigned
                  to programs and grades.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/subjects"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Adding Subject...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Subject
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