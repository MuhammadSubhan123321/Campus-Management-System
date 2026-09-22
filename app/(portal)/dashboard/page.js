"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  History,
  Plus,
  School,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  const [data, setData] = useState({
    students: [],
    teachers: [],
    classes: [],
    programs: [],
    records: [],
  });

  const [studentAttendance, setStudentAttendance] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD DASHBOARD
  // =========================================
  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        // CURRENT USER
        const meResponse = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        const meData = await meResponse.json();

        if (!meResponse.ok) {
          throw new Error(
            meData.message ||
              "Failed to load user."
          );
        }

        const currentUser = meData.user;

        setUser(currentUser);

        // =====================================
        // ADMIN
        // =====================================
        if (currentUser.role === "admin") {
          const [
            studentsResponse,
            teachersResponse,
            classesResponse,
            programsResponse,
            attendanceResponse,
          ] = await Promise.all([
            fetch("/api/students"),
            fetch("/api/teachers"),
            fetch("/api/classes"),
            fetch("/api/programs"),
            fetch("/api/attendance"),
          ]);

          const [
            studentsData,
            teachersData,
            classesData,
            programsData,
            attendanceData,
          ] = await Promise.all([
            studentsResponse.json(),
            teachersResponse.json(),
            classesResponse.json(),
            programsResponse.json(),
            attendanceResponse.json(),
          ]);

          if (
            !studentsResponse.ok ||
            !teachersResponse.ok ||
            !classesResponse.ok ||
            !programsResponse.ok ||
            !attendanceResponse.ok
          ) {
            throw new Error(
              "Failed to load dashboard data."
            );
          }

          setData({
            students:
              studentsData.students || [],
            teachers:
              teachersData.teachers || [],
            classes:
              classesData.classes || [],
            programs:
              programsData.programs || [],
            records:
              attendanceData.records || [],
          });
        }

        // =====================================
        // TEACHER
        // =====================================
        if (currentUser.role === "teacher") {
          const [
            studentsResponse,
            classesResponse,
            attendanceResponse,
          ] = await Promise.all([
            fetch("/api/students"),
            fetch("/api/classes"),
            fetch("/api/attendance"),
          ]);

          const [
            studentsData,
            classesData,
            attendanceData,
          ] = await Promise.all([
            studentsResponse.json(),
            classesResponse.json(),
            attendanceResponse.json(),
          ]);

          if (
            !studentsResponse.ok ||
            !classesResponse.ok ||
            !attendanceResponse.ok
          ) {
            throw new Error(
              "Failed to load teacher dashboard."
            );
          }

          setData({
            students:
              studentsData.students || [],
            teachers: [],
            classes:
              classesData.classes || [],
            programs: [],
            records:
              attendanceData.records || [],
          });
        }

        // =====================================
        // STUDENT
        // =====================================
        if (currentUser.role === "student") {
          const attendanceResponse =
            await fetch(
              "/api/student/attendance",
              {
                cache: "no-store",
              }
            );

          const attendanceData =
            await attendanceResponse.json();

          if (!attendanceResponse.ok) {
            throw new Error(
              attendanceData.message ||
                "Failed to load your attendance."
            );
          }

          setStudentAttendance(
            attendanceData
          );
        }
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // =========================================
  // DATE HELPERS
  // =========================================
  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const [year, month, day] =
      dateValue
        .split("T")[0]
        .split("-");

    return `${day}/${month}/${year}`;
  }

  function currentDate() {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    ).format(new Date());
  }

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-full space-y-7 bg-[#f8faf9]">
        <div>
          <Skeleton className="h-9 w-48" />

          <Skeleton className="mt-3 h-5 w-80 max-w-full" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className="h-40 rounded-2xl"
            />
          ))}
        </div>

        <Skeleton className="h-52 rounded-2xl" />

        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  // =========================================
  // NO USER
  // =========================================
  if (!user) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center gap-3 p-6 text-red-700">
          <XCircle className="h-5 w-5" />

          <p>
            Unable to load your account.
          </p>
        </CardContent>
      </Card>
    );
  }

  // =========================================
  // STUDENT DASHBOARD
  // =========================================
  if (user.role === "student") {
    const overall =
      studentAttendance?.overall || {
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0,
      };

    const student =
      studentAttendance?.student;

    const studentCards = [
      {
        title: "Attendance",
        value: `${overall.percentage}%`,
        description: "Overall attendance",
        icon: BarChart3,
        theme: "mint",
      },
      {
        title: "Total Records",
        value: overall.total,
        description: "Attendance entries",
        icon: CalendarDays,
        theme: "blue",
      },
      {
        title: "Present",
        value: overall.present,
        description: "Classes attended",
        icon: CheckCircle2,
        theme: "green",
      },
      {
        title: "Absent",
        value: overall.absent,
        description: "Classes missed",
        icon: XCircle,
        theme: "orange",
      },
    ];

    return (
      <div className="space-y-7">
        <DashboardHeading
          badge="Student"
          title={`Welcome, ${user.name}`}
          description="Track your attendance and academic information."
          date={currentDate()}
        />

        {error && (
          <ErrorMessage message={error} />
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {studentCards.map((card) => (
            <ColorStatCard
              key={card.title}
              {...card}
            />
          ))}
        </div>

        <Card className="overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>
                  Student Information
                </CardTitle>

                <CardDescription className="mt-1">
                  Your current enrollment
                  details.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <InfoBox
                label="Roll Number"
                value={
                  student?.rollNumber || "—"
                }
              />

              <InfoBox
                label="Class"
                value={
                  student?.class
                    ?.className || "—"
                }
              />

              <InfoBox
                label="Section"
                value={
                  student?.class
                    ?.section || "—"
                }
              />
            </div>
          </CardContent>
        </Card>

        <QuickActionSection columns="md:grid-cols-1">
          <QuickAction
            href="/my-attendance"
            title="My Attendance"
            description="View your subject-wise attendance and complete attendance history."
            icon={ClipboardCheck}
            theme="mint"
          />
        </QuickActionSection>
      </div>
    );
  }

  // =========================================
  // ADMIN + TEACHER
  // =========================================
  const isAdmin =
    user.role === "admin";

  const recentRecords =
    data.records.slice(0, 5);

  const summaryCards = isAdmin
    ? [
        {
          title: "Students",
          value: data.students.length,
          description:
            "Registered students",
          href: "/students",
          icon: GraduationCap,
          theme: "mint",
        },
        {
          title: "Teachers",
          value: data.teachers.length,
          description:
            "Registered teachers",
          href: "/teachers",
          icon: Users,
          theme: "orange",
        },
        {
          title: "Classes",
          value: data.classes.length,
          description:
            "Available classes",
          href: "/classes",
          icon: School,
          theme: "blue",
        },
        {
          title: "Programs",
          value: data.programs.length,
          description:
            "Academic programs",
          href: "/programs",
          icon: BookOpenCheck,
          theme: "purple",
        },
      ]
    : [
        {
          title: "My Students",
          value: data.students.length,
          description:
            "Students in your classes",
          href: "/students",
          icon: GraduationCap,
          theme: "mint",
        },
        {
          title: "My Classes",
          value: data.classes.length,
          description:
            "Assigned classes",
          href: "/classes",
          icon: School,
          theme: "blue",
        },
        {
          title: "Attendance Records",
          value: data.records.length,
          description:
            "Recorded attendance",
          href: "/attendance/records",
          icon: History,
          theme: "purple",
        },
      ];

  return (
    <div className="space-y-7">
      {/* =====================================
          DASHBOARD HEADER
      ====================================== */}
      <DashboardHeading
        badge={
          isAdmin
            ? "Administrator"
            : "Teacher"
        }
        title="Dashboard"
        description={
          isAdmin
            ? "Monitor students, teachers, classes and attendance activity from one place."
            : `Welcome, ${user.name}. Manage your assigned classes and attendance.`
        }
        date={currentDate()}
      />

      {/* ERROR */}
      {error && (
        <ErrorMessage message={error} />
      )}

      {/* =====================================
          STAT CARDS
      ====================================== */}
      <div
        className={`grid gap-5 sm:grid-cols-2 ${
          isAdmin
            ? "xl:grid-cols-4"
            : "lg:grid-cols-3"
        }`}
      >
        {summaryCards.map((card) => (
          <ColorStatCard
            key={card.title}
            {...card}
          />
        ))}
      </div>

      {/* =====================================
          QUICK ACTIONS
      ====================================== */}
      <QuickActionSection
        columns={
          isAdmin
            ? "md:grid-cols-3"
            : "md:grid-cols-2"
        }
      >
        <QuickAction
          href="/attendance/mark"
          title="Mark Attendance"
          description="Record attendance for a class and subject."
          icon={ClipboardCheck}
          theme="mint"
        />

        {isAdmin && (
          <QuickAction
            href="/students/add"
            title="Add Student"
            description="Register a new student in the portal."
            icon={Plus}
            theme="orange"
          />
        )}

        <QuickAction
          href="/attendance/records"
          title="Attendance Records"
          description="Review previously recorded attendance."
          icon={History}
          theme="blue"
        />
      </QuickActionSection>

      {/* =====================================
          RECENT ATTENDANCE
      ====================================== */}
      <Card className="overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 border-b border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">
              Recent Attendance
            </CardTitle>

            <CardDescription className="mt-1">
              Latest attendance records
              available to your account.
            </CardDescription>
          </div>

          {/* IMPORTANT:
              Normal Link instead of Button asChild.
          */}
          <Link
            href="/attendance/records"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-teal-200 px-3 text-sm font-medium text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
          >
            View All

            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-[#f8faf9] hover:bg-[#f8faf9]">
                <TableHead className="font-semibold text-slate-600">
                  Date
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Class
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Subject
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Teacher
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Present
                </TableHead>

                <TableHead className="font-semibold text-slate-600">
                  Absent
                </TableHead>

                <TableHead className="text-right font-semibold text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-36 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                        <ClipboardCheck className="h-6 w-6 text-teal-500" />
                      </div>

                      <p className="font-semibold text-slate-600">
                        No attendance records yet
                      </p>

                      <p className="mt-1 text-sm">
                        New records will appear
                        here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                recentRecords.map(
                  (record) => {
                    const presentCount =
                      record.students?.filter(
                        (item) =>
                          item.status ===
                          "Present"
                      ).length || 0;

                    const absentCount =
                      record.students?.filter(
                        (item) =>
                          item.status ===
                          "Absent"
                      ).length || 0;

                    return (
                      <TableRow
                        key={record._id}
                        className="border-slate-100 transition-colors hover:bg-teal-50/30"
                      >
                        <TableCell className="whitespace-nowrap text-slate-500">
                          {formatDate(
                            record.date
                          )}
                        </TableCell>

                        <TableCell>
                          <p className="font-semibold text-slate-700">
                            {record.class
                              ?.className ||
                              "—"}
                          </p>

                          {record.class
                            ?.section && (
                            <p className="mt-1 text-xs text-slate-400">
                              Section{" "}
                              {
                                record.class
                                  .section
                              }
                            </p>
                          )}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {record.subject
                            ?.name || "—"}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {record.class
                            ?.teacher?.name ||
                            "—"}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1.5 border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          >
                            <UserCheck className="h-3.5 w-3.5" />

                            {presentCount}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1.5 border-0 bg-red-50 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />

                            {absentCount}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          {/* IMPORTANT:
                              Normal Link instead
                              of Button asChild.
                          */}
                          <Link
                            href={`/attendance/records/${record._id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50 hover:text-teal-800"
                          >
                            View

                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ===========================================
// DASHBOARD HEADING
// ===========================================
function DashboardHeading({
  badge,
  title,
  description,
  date,
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-teal-50 px-3 py-1 capitalize text-teal-700 hover:bg-teal-50"
          >
            {badge}
          </Badge>

          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <CalendarDays className="h-[18px] w-[18px]" />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Today
          </p>

          <p className="mt-0.5 text-sm font-semibold text-slate-700">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// COLOR STAT CARD
// ===========================================
function ColorStatCard({
  title,
  value,
  description,
  href,
  icon: Icon,
  theme = "mint",
}) {
  const themes = {
    mint: {
      card:
        "border-emerald-100 bg-gradient-to-br from-[#e9fbf4] to-[#f7fffb]",
      icon:
        "bg-[#c9f4e2] text-[#087c68]",
      arrow:
        "text-[#087c68]",
      glow:
        "bg-emerald-300/20",
    },

    orange: {
      card:
        "border-orange-100 bg-gradient-to-br from-[#fff2e5] to-[#fffaf5]",
      icon:
        "bg-[#ffe0bd] text-[#d96b16]",
      arrow:
        "text-[#d96b16]",
      glow:
        "bg-orange-300/20",
    },

    blue: {
      card:
        "border-sky-100 bg-gradient-to-br from-[#eaf6ff] to-[#f7fbff]",
      icon:
        "bg-[#cfeaff] text-[#2878b8]",
      arrow:
        "text-[#2878b8]",
      glow:
        "bg-sky-300/20",
    },

    purple: {
      card:
        "border-violet-100 bg-gradient-to-br from-[#f3edff] to-[#fbf9ff]",
      icon:
        "bg-[#e5d7ff] text-[#7850b9]",
      arrow:
        "text-[#7850b9]",
      glow:
        "bg-violet-300/20",
    },

    green: {
      card:
        "border-green-100 bg-gradient-to-br from-green-50 to-white",
      icon:
        "bg-green-100 text-green-700",
      arrow:
        "text-green-700",
      glow:
        "bg-green-300/20",
    },
  };

  const colors =
    themes[theme] || themes.mint;

  const content = (
    <Card
      className={`
        relative
        h-full
        overflow-hidden
        rounded-2xl
        shadow-sm
        transition-all
        duration-300
        group-hover:-translate-y-1
        group-hover:shadow-lg
        ${colors.card}
      `}
    >
      <div
        className={`
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-24
          w-24
          rounded-full
          blur-2xl
          transition-transform
          duration-500
          group-hover:scale-150
          ${colors.glow}
        `}
      />

      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              shadow-sm
              transition-transform
              duration-300
              group-hover:scale-110
              ${colors.icon}
            `}
          >
            <Icon className="h-5 w-5" />
          </div>

          {href && (
            <ArrowRight
              className={`
                h-4
                w-4
                opacity-0
                transition-all
                duration-300
                group-hover:translate-x-1
                group-hover:opacity-100
                ${colors.arrow}
              `}
            />
          )}
        </div>

        <p className="mt-5 text-3xl font-bold tracking-tight text-slate-800">
          {value}
        </p>

        <p className="mt-1 font-semibold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  if (!href) {
    return (
      <div className="group">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block"
    >
      {content}
    </Link>
  );
}

// ===========================================
// QUICK ACTION SECTION
// ===========================================
function QuickActionSection({
  children,
  columns,
}) {
  return (
    <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-slate-800">
          Quick Actions
        </CardTitle>

        <CardDescription>
          Common tasks for your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div
          className={`grid gap-4 ${columns}`}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// ===========================================
// QUICK ACTION
// ===========================================
function QuickAction({
  href,
  title,
  description,
  icon: Icon,
  theme = "mint",
}) {
  const themes = {
    mint: {
      box: "bg-[#e9fbf4]",
      border: "border-emerald-100",
      icon: "bg-[#c9f4e2] text-[#087c68]",
      hover: "hover:border-emerald-200",
    },

    orange: {
      box: "bg-[#fff4e8]",
      border: "border-orange-100",
      icon: "bg-[#ffe1c1] text-[#d96b16]",
      hover: "hover:border-orange-200",
    },

    blue: {
      box: "bg-[#edf7ff]",
      border: "border-sky-100",
      icon: "bg-[#d3ecff] text-[#2878b8]",
      hover: "hover:border-sky-200",
    },
  };

  const colors =
    themes[theme] || themes.mint;

  return (
    <Link
      href={href}
      className={`
        group
        rounded-xl
        border
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
        ${colors.box}
        ${colors.border}
        ${colors.hover}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            transition-transform
            duration-300
            group-hover:scale-110
            ${colors.icon}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>

        <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-700" />
      </div>

      <p className="mt-4 font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

// ===========================================
// STUDENT INFO BOX
// ===========================================
function InfoBox({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#f8faf9] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

// ===========================================
// ERROR MESSAGE
// ===========================================
function ErrorMessage({
  message,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <XCircle className="h-5 w-5 shrink-0" />

      <p>{message}</p>
    </div>
  );
}