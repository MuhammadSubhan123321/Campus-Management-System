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
  Check,
  GraduationCap,
  Hash,
  Phone,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    class: "",
    gender: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    isActive: true,
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD STUDENT + CLASSES
  // =========================================
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [
          studentResponse,
          classesResponse,
        ] = await Promise.all([
          fetch(`/api/students/${id}`),
          fetch("/api/classes"),
        ]);

        const studentData =
          await studentResponse.json();

        const classesData =
          await classesResponse.json();

        if (!studentResponse.ok) {
          throw new Error(
            studentData.message ||
              "Failed to load student."
          );
        }

        if (!classesResponse.ok) {
          throw new Error(
            classesData.message ||
              "Failed to load classes."
          );
        }

        const student = studentData.student;

        setFormData({
          name: student.name || "",
          rollNumber:
            student.rollNumber || "",

          class:
            typeof student.class === "object"
              ? student.class?._id || ""
              : student.class || "",

          gender: student.gender || "",
          phone: student.phone || "",
          guardianName:
            student.guardianName || "",
          guardianPhone:
            student.guardianPhone || "",

          isActive:
            student.isActive !== false,
        });

        setClasses(classesData.classes || []);
      } catch (error) {
        console.error(
          "Load student error:",
          error
        );

        setError(
          error.message ||
            "Failed to load student."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  // =========================================
  // INPUT CHANGE
  // =========================================
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // =========================================
  // STATUS CHANGE
  // =========================================
  function handleStatusChange(event) {
    const value = event.target.value;

    setFormData((previousData) => ({
      ...previousData,
      isActive: value === "active",
    }));
  }

  // =========================================
  // SAVE STUDENT
  // =========================================
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.rollNumber.trim() ||
      !formData.class ||
      !formData.gender
    ) {
      setError(
        "Student name, roll number, class and gender are required."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/students/${id}`,
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
            "Failed to update student."
        );
        return;
      }

      router.push(`/students/${id}`);
      router.refresh();
    } catch (error) {
      console.error(
        "Update student error:",
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
            Loading student...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* =====================================
          BACK BUTTON
      ====================================== */}
      <Link
        href={`/students/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Student Profile
      </Link>

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <GraduationCap className="h-4 w-4" />
          Student Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Edit Student
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Update student information, class
          assignment and account status.
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
            STUDENT INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-teal-50/80 to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <User className="h-5 w-5" />
              </div>

              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Student Information
                </CardTitle>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Changes will update this student&apos;s
                  portal information.
               </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* STUDENT NAME */}
              <FormField
                icon={User}
                label="Student Name"
                required
              >
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                />
              </FormField>

              {/* ROLL NUMBER */}
              <FormField
                icon={Hash}
                label="Roll Number"
                required
              >
                <Input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                />
              </FormField>

              {/* CLASS */}
              <FormField
                icon={BookOpen}
                label="Class"
                required
              >
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10"
                >
                  <option value="">
                    {classes.length === 0
                      ? "No Classes Available"
                      : "Select Class"}
                  </option>

                  {classes.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.className} - Section{" "}
                      {item.section}
                      {item.program?.name
                        ? ` | ${item.program.name}`
                        : ""}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* GENDER */}
              <FormField
                icon={Users}
                label="Gender"
                required
              >
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
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
                  className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                />
              </FormField>

              {/* STATUS */}
              <FormField
                icon={ShieldCheck}
                label="Status"
              >
                <select
                  value={
                    formData.isActive
                      ? "active"
                      : "inactive"
                  }
                  onChange={handleStatusChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            GUARDIAN INFORMATION
        ==================================== */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Guardian Information
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Update parent or guardian contact
                  information.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* GUARDIAN NAME */}
              <FormField
                icon={User}
                label="Guardian Name"
              >
                <Input
                  type="text"
                  name="guardianName"
                  value={
                    formData.guardianName
                  }
                  onChange={handleChange}
                  placeholder="Enter guardian name"
                  className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                />
              </FormField>

              {/* GUARDIAN PHONE */}
              <FormField
                icon={Phone}
                label="Guardian Phone"
              >
                <Input
                  type="text"
                  name="guardianPhone"
                  value={
                    formData.guardianPhone
                  }
                  onChange={handleChange}
                  placeholder="Enter guardian phone"
                  className="h-11 rounded-xl border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===================================
            SAVE AREA
        ==================================== */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ready to save?
                </p>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Changes will update this student&apos;s
                  portal information.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                asChild
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-slate-200 px-5 font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              >
                <Link
                  href={`/students/${id}`}
                >
                  Cancel
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={
                  saving ||
                  classes.length === 0
                }
                className="h-11 rounded-xl bg-teal-600 px-5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:translate-y-0 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

// =========================================
// REUSABLE FORM FIELD
// =========================================
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