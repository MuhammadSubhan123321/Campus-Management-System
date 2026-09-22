"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  IdCard,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherDetailPage() {
  const params = useParams();
  const id = params.id;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
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

        setTeacher(data.teacher);
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
  // FORMAT DATE
  // =========================================
  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not provided";
    }

    return new Date(
      dateValue
    ).toLocaleDateString();
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
            Loading teacher profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (error || !teacher) {
    return (
      <div className="space-y-5">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teachers
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error || "Teacher not found."}
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
        href="/teachers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:-translate-x-1 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teachers
      </Link>

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Users className="h-4 w-4" />
            Faculty Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Teacher Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            View teacher contact, academic and
            employment information.
          </p>
        </div>

        <Link
          href={`/teachers/${teacher._id}/edit`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md"
        >
          <Pencil className="h-4 w-4" />
          Edit Teacher
        </Link>
      </div>

      {/* =====================================
          TEACHER HERO
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50/60 to-white px-6 py-7 md:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* AVATAR */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-2xl font-bold uppercase text-teal-700 shadow-sm">
              {teacher.name
                ?.charAt(0)
                .toUpperCase() || "T"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {teacher.name}
                </h2>

                <Badge
                  className={
                    teacher.isActive
                      ? "border-0 bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100"
                      : "border-0 bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-100"
                  }
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      teacher.isActive
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {teacher.isActive
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-teal-600" />

                  <strong className="font-semibold text-slate-700">
                    {teacher.employeeId}
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-teal-600" />

                  {teacher.qualification ||
                    "Qualification not provided"}
                </span>

                <span className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-teal-600" />

                  {teacher.specialization ||
                    "Specialization not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* =====================================
          CONTACT INFORMATION
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50/70 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Teacher identity and contact
                details.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <InfoItem
              icon={User}
              label="Teacher Name"
              value={teacher.name}
            />

            <InfoItem
              icon={IdCard}
              label="Employee ID"
              value={teacher.employeeId}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={
                teacher.email ||
                "Not provided"
              }
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={
                teacher.phone ||
                "Not provided"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          ACADEMIC / EMPLOYMENT INFORMATION
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50/80 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Academic & Employment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Qualification, specialization and
                employment information.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <InfoItem
              icon={GraduationCap}
              label="Qualification"
              value={
                teacher.qualification ||
                "Not provided"
              }
            />

            <InfoItem
              icon={BriefcaseBusiness}
              label="Specialization"
              value={
                teacher.specialization ||
                "Not provided"
              }
            />

            <InfoItem
              icon={CalendarDays}
              label="Joining Date"
              value={formatDate(
                teacher.joiningDate
              )}
            />

            {/* STATUS */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </p>

              <div className="mt-2 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    teacher.isActive
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <Badge
                  className={
                    teacher.isActive
                      ? "border-0 bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100"
                      : "border-0 bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-100"
                  }
                >
                  {teacher.isActive
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================
          PROFILE SUMMARY
      ====================================== */}
      <Card className="rounded-2xl border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Faculty Profile
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {teacher.name} is registered under
              employee ID{" "}
              <span className="font-semibold text-slate-700">
                {teacher.employeeId}
              </span>
              {teacher.specialization
                ? ` with a specialization in ${teacher.specialization}.`
                : "."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===========================================
// INFORMATION ITEM
// ===========================================
function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>

        <p className="min-w-0 break-words pt-2 font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}