"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddTeacherPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    joiningDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // =========================================
  // ADD TEACHER
  // =========================================
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.employeeId.trim()
    ) {
      setError(
        "Teacher name and employee ID are required."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/teachers",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to add teacher."
        );
        return;
      }

      router.push("/teachers");
      router.refresh();
    } catch (error) {
      console.error(
        "Add teacher error:",
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

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href="/teachers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teachers
      </Link>

      {/* =====================================
          HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <Plus className="h-4 w-4" />
          Faculty Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Add Teacher
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Register a new teacher and add their
          professional and academic information.
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
            BASIC INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
                <User className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the teacher&apos;s identity
                  and contact information.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* TEACHER NAME */}
              <FormField
                icon={User}
                label="Teacher Name"
                required
              >
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Muhammad Ali"
                  className={inputClassName}
                />
              </FormField>

              {/* EMPLOYEE ID */}
              <FormField
                icon={IdCard}
                label="Employee ID"
                required
              >
                <Input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Example: TCH-001"
                  className={inputClassName}
                />
              </FormField>

              {/* EMAIL */}
              <FormField
                icon={Mail}
                label="Email"
              >
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Example: ali@school.com"
                  className={inputClassName}
                />
              </FormField>

              {/* PHONE */}
              <FormField
                icon={Phone}
                label="Phone"
              >
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Example: 03001234567"
                  className={inputClassName}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            ACADEMIC INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50/50 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Academic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add qualification,
                  specialization and employment
                  details.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* QUALIFICATION */}
              <FormField
                icon={GraduationCap}
                label="Qualification"
              >
                <Input
                  type="text"
                  name="qualification"
                  value={
                    formData.qualification
                  }
                  onChange={handleChange}
                  placeholder="Example: MSc Physics"
                  className={inputClassName}
                />
              </FormField>

              {/* SPECIALIZATION */}
              <FormField
                icon={BriefcaseBusiness}
                label="Specialization"
              >
                <Input
                  type="text"
                  name="specialization"
                  value={
                    formData.specialization
                  }
                  onChange={handleChange}
                  placeholder="Example: Physics"
                  className={inputClassName}
                />
              </FormField>

              {/* JOINING DATE */}
              <FormField
                icon={CalendarDays}
                label="Joining Date"
              >
                <Input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            SAVE AREA
        ==================================== */}
        <Card className="rounded-2xl border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ready to register?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Teacher name and employee ID are
                  required. Other information can
                  be added now or updated later.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {/* CANCEL */}
              <Link
                href="/teachers"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
              >
                Cancel
              </Link>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Adding Teacher...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Teacher
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