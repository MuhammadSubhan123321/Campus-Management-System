"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Layers3,
  Plus,
  Save,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddClassPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    className: "",
    section: "",
    program: "",
    teacher: "",
    time: "",
    room: "",
    academicYear: "",
  });

  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] =
    useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PROGRAMS + TEACHERS
  // =========================================
  useEffect(() => {
    async function fetchFormData() {
      try {
        setPageLoading(true);
        setError("");

        const [
          programsResponse,
          teachersResponse,
        ] = await Promise.all([
          fetch("/api/programs"),
          fetch("/api/teachers"),
        ]);

        const programsData =
          await programsResponse.json();

        const teachersData =
          await teachersResponse.json();

        if (!programsResponse.ok) {
          throw new Error(
            programsData.message ||
              "Failed to load programs."
          );
        }

        if (!teachersResponse.ok) {
          throw new Error(
            teachersData.message ||
              "Failed to load teachers."
          );
        }

        const activePrograms = (
          programsData.programs || []
        ).filter(
          (program) =>
            program.isActive !== false
        );

        const activeTeachers = (
          teachersData.teachers || []
        ).filter(
          (teacher) =>
            teacher.isActive !== false
        );

        setPrograms(activePrograms);
        setTeachers(activeTeachers);
      } catch (error) {
        console.error(
          "Load class form data error:",
          error
        );

        setError(
          error.message ||
            "Failed to load programs or teachers."
        );
      } finally {
        setPageLoading(false);
      }
    }

    fetchFormData();
  }, []);

  // =========================================
  // NORMAL INPUT CHANGE
  // =========================================
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // =========================================
  // GRADE CHANGE
  // Reset program because available programs
  // depend on the selected grade.
  // =========================================
  function handleGradeChange(event) {
    const value = event.target.value;

    setFormData((previousData) => ({
      ...previousData,
      className: value,
      program: "",
    }));
  }

  // =========================================
  // CREATE CLASS
  // =========================================
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.className ||
      !formData.section ||
      !formData.program ||
      !formData.teacher ||
      !formData.time
    ) {
      setError(
        "Grade, section, program, teacher and time are required."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/classes",
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
            "Failed to add class."
        );

        return;
      }

      router.push("/classes");
      router.refresh();
    } catch (error) {
      console.error(
        "Add class error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // FILTER PROGRAMS BY GRADE
  // =========================================
  const selectedGrade = formData.className
    ? Number(
        formData.className.replace(
          "Grade ",
          ""
        )
      )
    : null;

  const availablePrograms =
    programs.filter((program) => {
      if (!selectedGrade) {
        return false;
      }

      return (
        selectedGrade >=
          program.gradeFrom &&
        selectedGrade <= program.gradeTo
      );
    });

  // =========================================
  // LOADING
  // =========================================
  if (pageLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading class form...
          </p>
        </div>
      </div>
    );
  }

  const inputClassName =
    "h-11 rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";

  const selectClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href="/classes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Classes
      </Link>

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <Plus className="h-4 w-4" />
          Academic Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Add Class
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Create a new class and configure
          its academic, teacher and schedule
          information.
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

      {/* =====================================
          FORM
      ====================================== */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* ===================================
            ACADEMIC INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Academic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the grade, section
                  and academic program.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* GRADE */}
              <FormField
                icon={GraduationCap}
                label="Grade"
                required
              >
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleGradeChange}
                  className={selectClassName}
                >
                  <option value="">
                    Select Grade
                  </option>

                  <option value="Grade 1">
                    Grade 1
                  </option>

                  <option value="Grade 2">
                    Grade 2
                  </option>

                  <option value="Grade 3">
                    Grade 3
                  </option>

                  <option value="Grade 4">
                    Grade 4
                  </option>

                  <option value="Grade 5">
                    Grade 5
                  </option>

                  <option value="Grade 6">
                    Grade 6
                  </option>

                  <option value="Grade 7">
                    Grade 7
                  </option>

                  <option value="Grade 8">
                    Grade 8
                  </option>

                  <option value="Grade 9">
                    Grade 9
                  </option>

                  <option value="Grade 10">
                    Grade 10
                  </option>

                  <option value="Grade 11">
                    Grade 11
                  </option>

                  <option value="Grade 12">
                    Grade 12
                  </option>
                </select>
              </FormField>

              {/* SECTION */}
              <FormField
                icon={Layers3}
                label="Section"
                required
              >
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">
                    Select Section
                  </option>

                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </FormField>

              {/* PROGRAM */}
              <FormField
                icon={BookOpenCheck}
                label="Academic Program"
                required
              >
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  disabled={
                    !formData.className
                  }
                  className={selectClassName}
                >
                  <option value="">
                    {!formData.className
                      ? "Select Grade First"
                      : availablePrograms.length ===
                          0
                        ? "No Programs Available"
                        : "Select Program"}
                  </option>

                  {availablePrograms.map(
                    (program) => (
                      <option
                        key={program._id}
                        value={program._id}
                      >
                        {program.name}
                      </option>
                    )
                  )}
                </select>

                {formData.className &&
                  availablePrograms.length >
                    0 && (
                    <p className="mt-2 text-xs text-slate-400">
                      {
                        availablePrograms.length
                      }{" "}
                      compatible{" "}
                      {availablePrograms.length ===
                      1
                        ? "program"
                        : "programs"}{" "}
                      available for{" "}
                      {formData.className}.
                    </p>
                  )}
              </FormField>

              {/* CLASS TEACHER */}
              <FormField
                icon={UserRoundCheck}
                label="Class Teacher"
                required
              >
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">
                    {teachers.length === 0
                      ? "No Active Teachers"
                      : "Select Teacher"}
                  </option>

                  {teachers.map(
                    (teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.name} (
                        {teacher.employeeId})
                      </option>
                    )
                  )}
                </select>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            SCHEDULE INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                <Clock3 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Schedule & Location
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the class time,
                  room and academic year.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* TIME */}
              <FormField
                icon={Clock3}
                label="Class Time"
                required
              >
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </FormField>

              {/* ROOM */}
              <FormField
                icon={Building2}
                label="Room"
              >
                <Input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="Example: Room 12"
                  className={inputClassName}
                />
              </FormField>

              {/* ACADEMIC YEAR */}
              <FormField
                icon={CalendarDays}
                label="Academic Year"
              >
                <Input
                  type="text"
                  name="academicYear"
                  value={
                    formData.academicYear
                  }
                  onChange={handleChange}
                  placeholder="Example: 2026-2027"
                  className={inputClassName}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            CURRENT SELECTION PREVIEW
        ==================================== */}
        {(formData.className ||
          formData.section ||
          formData.program ||
          formData.teacher) && (
          <Card className="rounded-2xl border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <UsersRound className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Class Setup
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {formData.className ||
                      "Grade not selected"}

                    {formData.section
                      ? ` • Section ${formData.section}`
                      : ""}

                    {formData.program
                      ? ` • ${
                          programs.find(
                            (program) =>
                              program._id ===
                              formData.program
                          )?.name ||
                          "Selected Program"
                        }`
                      : ""}

                    {formData.teacher
                      ? ` • ${
                          teachers.find(
                            (teacher) =>
                              teacher._id ===
                              formData.teacher
                          )?.name ||
                          "Selected Teacher"
                        }`
                      : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===================================
            SAVE AREA
        ==================================== */}
        <Card className="rounded-2xl border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ready to create the class?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Grade, section, academic
                  program, class teacher and
                  class time are required.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/classes"
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
                    Adding Class...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Class
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

// ===========================================
// REUSABLE FORM FIELD
// ===========================================
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