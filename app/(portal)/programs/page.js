"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
  Pencil,
  Plus,
  School,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/programs");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load programs."
          );
        }

        setPrograms(data.programs || []);
      } catch (error) {
        console.error(
          "Fetch programs error:",
          error
        );

        setError(
          error.message ||
            "Failed to load programs."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  const activePrograms = programs.filter(
    (program) => program.isActive
  ).length;

  return (
    <div className="space-y-7 pb-10">
      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
            <GraduationCap className="h-4 w-4" />
            Academic Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Programs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Manage academic programs, grade
            ranges and education systems.
          </p>
        </div>

        <Link
          href="/programs/add"
          className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Program
        </Link>
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
          SMALL SUMMARY
      ====================================== */}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {programs.length}
                </p>

                <p className="text-sm text-slate-500">
                  Total Programs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <School className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {activePrograms}
                </p>

                <p className="text-sm text-slate-500">
                  Active Programs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =====================================
          PROGRAM TABLE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-orange-600" />

              <h2 className="text-lg font-bold text-slate-900">
                Academic Programs
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              All configured academic programs and
              their education systems.
            </p>
          </div>

          {!loading && (
            <Badge className="w-fit border-0 bg-teal-50 px-3 py-1.5 font-semibold text-teal-700 hover:bg-teal-50">
              {programs.length} Total
            </Badge>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="px-6 font-semibold text-slate-600">
                  Program
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Level
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Grades
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  System
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Group
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Status
                </TableHead>

                <TableHead className="pr-6 text-right font-semibold text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

                      <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading programs...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center font-medium text-red-600"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : programs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-52 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        <GraduationCap className="h-7 w-7" />
                      </div>

                      <p className="mt-4 font-semibold text-slate-800">
                        No programs added yet
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Create your first academic
                        program to get started.
                      </p>

                      <Link
                        href="/programs/add"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
                      >
                        Add Program
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow
                    key={program._id}
                    className="border-slate-100 transition-colors hover:bg-teal-50/40"
                  >
                    {/* PROGRAM */}
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <GraduationCap className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {program.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Academic Program
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* LEVEL */}
                    <TableCell>
                      <span className="font-medium text-slate-600">
                        {program.level || "—"}
                      </span>
                    </TableCell>

                    {/* GRADES */}
                    <TableCell>
                      <Badge className="border-0 bg-orange-50 font-medium text-orange-700 hover:bg-orange-50">
                        {program.gradeFrom ===
                        program.gradeTo
                          ? `Grade ${program.gradeFrom}`
                          : `Grade ${program.gradeFrom} - ${program.gradeTo}`}
                      </Badge>
                    </TableCell>

                    {/* SYSTEM */}
                    <TableCell>
                      <span className="text-slate-600">
                        {program.system || "—"}
                      </span>
                    </TableCell>

                    {/* GROUP */}
                    <TableCell>
                      <span className="text-slate-600">
                        {program.group || "—"}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        className={
                          program.isActive
                            ? "border-0 bg-emerald-50 font-semibold text-emerald-700 hover:bg-emerald-50"
                            : "border-0 bg-slate-100 font-semibold text-slate-500 hover:bg-slate-100"
                        }
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            program.isActive
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {program.isActive
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* ACTION */}
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/programs/${program._id}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/programs/${program._id}/edit`}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}