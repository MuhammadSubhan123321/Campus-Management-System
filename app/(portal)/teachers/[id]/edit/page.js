"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
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

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    joiningDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD TEACHER
  // =========================================
  useEffect(() => {
    async function fetchTeacher() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/teachers/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load teacher."
          );
        }

        const teacher = data.teacher;

        setFormData({
          name: teacher.name || "",
          employeeId:
            teacher.employeeId || "",
          email: teacher.email || "",
          phone: teacher.phone || "",
          qualification:
            teacher.qualification || "",
          specialization:
            teacher.specialization || "",

          joiningDate: teacher.joiningDate
            ? teacher.joiningDate.split(
                "T"
              )[0]
            : "",

          isActive:
            teacher.isActive ?? true,
        });
      } catch (error) {
        console.error(
          "Fetch teacher error:",
          error
        );

        setError(
          error.message ||
            "Failed to load teacher."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTeacher();
    }
  }, [id]);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================
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

  // =========================================
  // UPDATE TEACHER
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
      setSaving(true);

      const response = await fetch(
        `/api/teachers/${id}`,
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
            "Failed to update teacher."
        );

        return;
      }

      router.push(`/teachers/${id}`);
      router.refresh();
    } catch (error) {
      console.error(
        "Update teacher error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
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
            Loading teacher...
          </p>
        </div>
      </div>
    );
  }

  const inputClassName =
    "h-11 rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK
      ====================================== */}
      <Link
        href={`/teachers/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teacher Profile
      </Link>

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <GraduationCap className="h-4 w-4" />
          Faculty Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Edit Teacher
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Update teacher information,
          professional details and account
          status.
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
                  Update the teacher&apos;s
                  identity and contact details.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* NAME */}
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
                  placeholder="Enter teacher name"
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
                  placeholder="Enter email address"
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
                  placeholder="Enter phone number"
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
                  Academic & Employment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update qualification,
                  specialization and employment
                  information.
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

              {/* STATUS */}
              <FormField
                icon={ShieldCheck}
                label="Status"
              >
                <label
                  className={`flex h-11 cursor-pointer items-center justify-between rounded-xl border px-4 transition-all ${
                    formData.isActive
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        formData.isActive
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    <span
                      className={`text-sm font-semibold ${
                        formData.isActive
                          ? "text-emerald-700"
                          : "text-slate-600"
                      }`}
                    >
                      {formData.isActive
                        ? "Active Teacher"
                        : "Inactive Teacher"}
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      formData.isActive
                    }
                    onChange={handleChange}
                    className="h-4 w-4 cursor-pointer accent-teal-600"
                  />
                </label>
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
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ready to save?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Changes will update this
                  teacher&apos;s portal
                  information.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {/* CANCEL */}
              <Link
                href={`/teachers/${id}`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
              >
                Cancel
              </Link>

              {/* SAVE */}
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