import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  History,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <CalendarCheck className="h-4 w-4" />
          Attendance
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Attendance Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
          Mark student attendance and review
          previous attendance records.
        </p>
      </div>

      {/* =====================================
          ATTENDANCE OPTIONS
      ====================================== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* MARK ATTENDANCE */}
        <Link
          href="/attendance/mark"
          className="group block"
        >
          <Card className="h-full overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-teal-300 group-hover:shadow-lg">
            <CardContent className="p-0">
              <div className="h-1.5 bg-teal-500 transition-all duration-200 group-hover:h-2" />

              <div className="p-6 md:p-7">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 transition-all duration-200 group-hover:bg-teal-600 group-hover:text-white">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-teal-50 group-hover:text-teal-700">
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                <Badge className="mb-4 border-0 bg-teal-100 px-3 py-1 font-semibold text-teal-700 hover:bg-teal-100">
                  Take Attendance
                </Badge>

                <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-teal-700">
                  Mark Attendance
                </h2>

                <p className="mt-3 leading-6 text-slate-500">
                  Select a class and subject, load
                  enrolled students and mark each
                  student as present or absent.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Users className="h-4 w-4 text-teal-600" />
                    Load Students
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    Present / Absent
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* ATTENDANCE RECORDS */}
        <Link
          href="/attendance/records"
          className="group block"
        >
          <Card className="h-full overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-orange-300 group-hover:shadow-lg">
            <CardContent className="p-0">
              <div className="h-1.5 bg-orange-400 transition-all duration-200 group-hover:h-2" />

              <div className="p-6 md:p-7">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition-all duration-200 group-hover:bg-orange-500 group-hover:text-white">
                    <History className="h-7 w-7" />
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-orange-50 group-hover:text-orange-700">
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                <Badge className="mb-4 border-0 bg-orange-100 px-3 py-1 font-semibold text-orange-700 hover:bg-orange-100">
                  Attendance History
                </Badge>

                <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-orange-700">
                  Attendance Records
                </h2>

                <p className="mt-3 leading-6 text-slate-500">
                  Review previous attendance
                  sessions and inspect individual
                  student attendance details.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <History className="h-4 w-4 text-orange-600" />
                    Previous Sessions
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Users className="h-4 w-4 text-orange-600" />
                    Student Details
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* =====================================
          SMALL INFO STRIP
      ====================================== */}
      <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-orange-50/60 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
            <CalendarCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Attendance Workflow
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Start with Mark Attendance to record a
              class session. Saved sessions can then
              be reviewed from Attendance Records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}