"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  FileText,
  GraduationCap,
  Layers3,
  Plus,
  School,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddProgramPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    gradeFrom: "",
    gradeTo: "",
    system: "",
    group: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const grades = Array.from(
    { length: 12 },
    (_, index) => index + 1
  );

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

    if (
      !formData.name.trim() ||
      !formData.level ||
      !formData.gradeFrom ||
      !formData.gradeTo ||
      !formData.system
    ) {
      setError(
        "Program name, level, grades and education system are required."
      );
      return;
    }

    if (
      Number(formData.gradeFrom) >
      Number(formData.gradeTo)
    ) {
      setError(
        "Starting grade cannot be greater than ending grade."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/programs",
        {
          method: "POST",
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
            "Failed to add program."
        );
        return;
      }

      router.push("/programs");
      router.refresh();
    } catch (error) {
      console.error(
        "Add program error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "h-11 rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";

  const selectClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20";

  const gradeText =
    formData.gradeFrom && formData.gradeTo
      ? formData.gradeFrom ===
        formData.gradeTo
        ? `Grade ${formData.gradeFrom}`
        : `Grade ${formData.gradeFrom} - ${formData.gradeTo}`
      : "Grade range not selected";

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* BACK */}
      <Link
        href="/programs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      {/* HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <GraduationCap className="h-4 w-4" />
          Academic Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Add Program
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Create a new academic program and
          define its level, grade range and
          education system.
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
        {/* MAIN INFORMATION */}
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
                  Enter the main academic
                  information for this program.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* NAME */}
              <FormField
                icon={BookOpen}
                label="Program Name"
                required
              >
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Matric Science"
                  className={inputClassName}
                />
              </FormField>

              {/* LEVEL */}
              <FormField
                icon={Layers3}
                label="Level"
                required
              >
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">
                    Select Level
                  </option>

                  <option value="Primary">
                    Primary
                  </option>

                  <option value="Middle">
                    Middle
                  </option>

                  <option value="Secondary">
                    Secondary
                  </option>

                  <option value="Higher Secondary">
                    Higher Secondary
                  </option>
                </select>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ACADEMIC STRUCTURE */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                <School className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Academic Structure
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define the grades and education
                  system covered by this program.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* START GRADE */}
              <FormField
                icon={GraduationCap}
                label="Starting Grade"
                required
              >
                <select
                  name="gradeFrom"
                  value={formData.gradeFrom}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">
                    Select Grade
                  </option>

                  {grades.map((grade) => (
                    <option
                      key={grade}
                      value={grade}
                    >
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* END GRADE */}
              <FormField
                icon={GraduationCap}
                label="Ending Grade"
                required
              >
                <select
                  name="gradeTo"
                  value={formData.gradeTo}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">
                    Select Grade
                  </option>

                  {grades.map((grade) => (
                    <option
                      key={grade}
                      value={grade}
                    >
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* SYSTEM */}
              <FormField
                icon={School}
                label="Education System"
                required
              >
                <select
                  name="system"
                  value={formData.system}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">
                    Select System
                  </option>

                  <option value="General">
                    General
                  </option>

                  <option value="Matric">
                    Matric
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="O Level">
                    O Level
                  </option>

                  <option value="A Level">
                    A Level
                  </option>
                </select>
              </FormField>

              {/* GROUP */}
              <FormField
                icon={Layers3}
                label="Group"
              >
                <Input
                  type="text"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  placeholder="Example: Science"
                  className={inputClassName}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Description
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Add optional information about
                  the program.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <Label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Program Description
            </Label>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter program description..."
              className="min-h-32 resize-y rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
            />
          </CardContent>
        </Card>

        {/* PREVIEW */}
        <Card className="rounded-2xl border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Program Preview
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {formData.name ||
                    "Program name"}

                  {formData.level
                    ? ` • ${formData.level}`
                    : ""}

                  {` • ${gradeText}`}

                  {formData.system
                    ? ` • ${formData.system}`
                    : ""}

                  {formData.group
                    ? ` • ${formData.group}`
                    : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTION AREA */}
        <Card className="rounded-2xl border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ready to create the program?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Required fields must be
                  completed before saving.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/programs"
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
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Program
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

function FormField({
  icon: Icon,
  label,
  required = false,
  children,
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" />

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </Label>

      {children}
    </div>
  );
}