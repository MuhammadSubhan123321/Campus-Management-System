"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Phone,
  Plus,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddStudentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    class: "",
    gender: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
  });

  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] =
    useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // LOAD CLASSES
  // =========================================
  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoadingClasses(true);
        setError("");

        const response = await fetch("/api/classes");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load classes."
          );
        }

        setClasses(data.classes || []);
      } catch (error) {
        console.error(
          "Fetch classes error:",
          error
        );

        setError(
          error.message ||
            "Failed to load classes."
        );
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, []);

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
  // SUBMIT STUDENT
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
      setLoading(true);

      const response = await fetch(
        "/api/students",
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
            "Failed to add student."
        );
        return;
      }

      router.push("/students");
      router.refresh();
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectClassName =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  const inputClassName =
    "h-11 rounded-xl border-slate-200 bg-slate-50 transition hover:border-teal-300 focus:bg-white";

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          BACK BUTTON
      ====================================== */}
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Link>

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <Plus className="h-4 w-4" />
          Student Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Add Student
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Register a new student and assign them
          to an available class.
        </p>
      </div>

      {/* =====================================
          FORM
      ====================================== */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl"
      >
        <div className="space-y-6">
          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* =================================
              STUDENT INFORMATION
          ================================== */}
          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
                  <User className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Student Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the student&apos;s basic
                    information.
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* NAME */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="font-semibold text-slate-700"
                  >
                    Student Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </Label>

                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    className={inputClassName}
                  />
                </div>

                {/* ROLL NUMBER */}
                <div className="space-y-2">
                  <Label
                    htmlFor="rollNumber"
                    className="font-semibold text-slate-700"
                  >
                    Roll Number
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </Label>

                  <Input
                    id="rollNumber"
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    className={inputClassName}
                  />
                </div>

                {/* CLASS */}
                <div className="space-y-2">
                  <Label
                    htmlFor="class"
                    className="font-semibold text-slate-700"
                  >
                    Class
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </Label>

                  <div className="relative">
                    <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      disabled={loadingClasses}
                      className={`${selectClassName} pl-10`}
                    >
                      <option value="">
                        {loadingClasses
                          ? "Loading Classes..."
                          : classes.length === 0
                            ? "No Classes Available"
                            : "Select Class"}
                      </option>

                      {classes.map((item) => (
                        <option
                          key={item._id}
                          value={item._id}
                        >
                          {item.className} -
                          Section {item.section}
                          {item.program?.name
                            ? ` | ${item.program.name}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* GENDER */}
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="font-semibold text-slate-700"
                  >
                    Gender
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </Label>

                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={selectClassName}
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
                </div>

                {/* PHONE */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="phone"
                    className="font-semibold text-slate-700"
                  >
                    Phone
                  </Label>

                  <div className="relative max-w-xl">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={`${inputClassName} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* =================================
              GUARDIAN INFORMATION
          ================================== */}
          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Guardian Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add parent or guardian contact
                    details.
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* GUARDIAN NAME */}
                <div className="space-y-2">
                  <Label
                    htmlFor="guardianName"
                    className="font-semibold text-slate-700"
                  >
                    Guardian Name
                  </Label>

                  <Input
                    id="guardianName"
                    type="text"
                    name="guardianName"
                    value={
                      formData.guardianName
                    }
                    onChange={handleChange}
                    placeholder="Enter guardian name"
                    className={inputClassName}
                  />
                </div>

                {/* GUARDIAN PHONE */}
                <div className="space-y-2">
                  <Label
                    htmlFor="guardianPhone"
                    className="font-semibold text-slate-700"
                  >
                    Guardian Phone
                  </Label>

                  <Input
                    id="guardianPhone"
                    type="text"
                    name="guardianPhone"
                    value={
                      formData.guardianPhone
                    }
                    onChange={handleChange}
                    placeholder="Enter guardian phone"
                    className={inputClassName}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* =================================
              ACTION AREA
          ================================== */}
          <Card className="rounded-2xl border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/40 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Ready to register?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Fields marked with * are
                    required.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/students"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                >
                  Cancel
                </Link>

                <Button
                  type="submit"
                  disabled={
                    loading ||
                    loadingClasses ||
                    classes.length === 0
                  }
                  className="h-11 rounded-xl bg-teal-600 px-5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md disabled:translate-y-0"
                >
                  <Plus className="h-4 w-4" />

                  {loading
                    ? "Adding Student..."
                    : "Add Student"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}