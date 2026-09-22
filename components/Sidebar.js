"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  LibraryBig,
  ClipboardCheck,
  History,
  BarChart3,
  UserRound,
  LogOut,
  Loader2,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] =
    useState(false);

  // =========================================
  // LOAD CURRENT USER
  // =========================================
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Load current user error:",
          error
        );

        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, [router]);

  // =========================================
  // LOGOUT
  // =========================================
  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      alert(
        "Failed to logout. Please try again."
      );

      setLoggingOut(false);
    }
  }

  // =========================================
  // ACTIVE ROUTE
  // =========================================
  function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  // =========================================
  // NAVIGATION LINK
  // =========================================
  function navLink(href, label, Icon) {
    const active = isActive(href);

    return (
      <Link
        key={href}
        href={href}
        className={`
          group
          relative
          flex
          items-center
          gap-2
          overflow-hidden
          rounded-xl
          px-2
          py-2
          text-sm
          font-medium
          transition-all
          duration-300
          ease-out

          ${
            active
              ? `
                bg-teal-300/20
                text-white
                shadow-[inset_0_0_0_1px_rgba(94,234,212,0.12)]
              `
              : `
                text-teal-50/75
                hover:translate-x-1
                hover:bg-teal-300/20
                hover:text-white
                hover:shadow-[inset_0_0_0_1px_rgba(94,234,212,0.16)]
              `
          }
        `}
      >
        {/* Animated hover sweep */}
        {!active && (
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              -translate-x-[120%]
              bg-gradient-to-r
              from-transparent
              via-teal-200/10
              to-transparent
              transition-transform
              duration-500
              ease-out
              group-hover:translate-x-[120%]
            "
          />
        )}

        {/* Active left indicator */}
        {active && (
          <span
            className="
              absolute
              left-0
              top-1/2
              h-7
              w-1
              -translate-y-1/2
              rounded-r-full
              bg-teal-300
              shadow-[0_0_10px_rgba(94,234,212,0.7)]
            "
          />
        )}

        {/* Icon */}
        <span
          className={`
            relative
            z-10
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            transition-all
            duration-300

            ${
              active
                ? `
                  bg-teal-300/15
                  text-teal-200
                `
                : `
                  text-teal-100/70
                  group-hover:scale-110
                  group-hover:bg-teal-300/15
                  group-hover:text-teal-200
                `
            }
          `}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        {/* Label */}
        <span className="relative z-10">
          {label}
        </span>
      </Link>
    );
  }

  // =========================================
  // LOADING SIDEBAR
  // =========================================
  if (loading) {
    return (
      <aside
        className="
          sticky
          top-0
          flex
          h-screen
          w-64
          shrink-0
          flex-col
          bg-gradient-to-b
          from-[#087473]
          via-[#056366]
          to-[#034c51]
          text-white
        "
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-teal-300
                text-[#05585c]
              "
            >
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <p className="font-semibold leading-tight">
                Attendance
              </p>

              <p className="font-semibold leading-tight">
                Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-teal-50/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      </aside>
    );
  }

  if (!user) {
    return null;
  }

  // =========================================
  // SIDEBAR
  // =========================================
  return (
    <aside
      className="
        sticky
        top-0
        flex
        h-screen
        w-64
        shrink-0
        flex-col
        overflow-hidden
        bg-gradient-to-b
        from-[#087473]
        via-[#056366]
        to-[#034c51]
        text-white
        shadow-xl
        shadow-slate-900/10
      "
    >
      {/* =====================================
          LOGO / BRAND
      ====================================== */}
      <div
        className="
          relative
          shrink-0
          border-b
          border-white/10
          px-5
          py-5
        "
      >
        {/* Decorative glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-12
            h-32
            w-32
            rounded-full
            bg-teal-300/10
            blur-2xl
          "
        />

        <div className="relative flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-teal-300
              text-[#05585c]
              shadow-lg
              shadow-black/10
              transition
              duration-300
              hover:rotate-3
              hover:scale-105
            "
          >
            <GraduationCap className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h1
              className="
                text-[17px]
                font-bold
                leading-5
                tracking-tight
                text-white
              "
            >
              Attendance
            </h1>

            <p
              className="
                text-[17px]
                font-bold
                leading-5
                tracking-tight
                text-white
              "
            >
              Portal
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          USER
      ====================================== */}
      <div className="shrink-0 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-teal-100
              to-cyan-50
              text-sm
              font-bold
              text-[#075f61]
              shadow-sm
            "
          >
            {user.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-semibold
                text-white
              "
            >
              {user.name}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                capitalize
                text-teal-100/70
              "
            >
              {user.role === "admin"
                ? "Administrator"
                : user.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-white/10" />

      {/* =====================================
          SCROLLABLE NAVIGATION
      ====================================== */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-3
          py-3

          [scrollbar-width:thin]
          [scrollbar-color:rgba(94,234,212,0.3)_transparent]

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent

          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-teal-300/25

          hover:[&::-webkit-scrollbar-thumb]:bg-teal-300/45
        "
      >
        <nav className="flex flex-col gap-1">
          {navLink(
            "/dashboard",
            "Dashboard",
            LayoutDashboard
          )}

          {/* =================================
              ADMIN LINKS
          ================================== */}
          {user.role === "admin" && (
            <>
              <div className="my-1" />

              {navLink(
                "/students",
                "Students",
                GraduationCap
              )}

              {navLink(
                "/teachers",
                "Teachers",
                Users
              )}

              {navLink(
                "/classes",
                "Classes",
                School
              )}

              {navLink(
                "/programs",
                "Programs",
                LibraryBig
              )}

              {navLink(
                "/subjects",
                "Subjects",
                BookOpen
              )}

              <div
                className="
                  mx-2
                  my-2
                  border-t
                  border-white/10
                "
              />

              {navLink(
                "/attendance/mark",
                "Mark Attendance",
                ClipboardCheck
              )}

              {navLink(
                "/attendance/records",
                "Attendance Records",
                History
              )}

              {navLink(
                "/reports",
                "Reports",
                BarChart3
              )}
            </>
          )}

          {/* =================================
              TEACHER LINKS
          ================================== */}
          {user.role === "teacher" && (
            <>
              <div className="my-1" />

              {navLink(
                "/students",
                "My Students",
                GraduationCap
              )}

              {navLink(
                "/classes",
                "My Classes",
                School
              )}

              <div
                className="
                  mx-2
                  my-2
                  border-t
                  border-white/10
                "
              />

              {navLink(
                "/attendance/mark",
                "Mark Attendance",
                ClipboardCheck
              )}

              {navLink(
                "/attendance/records",
                "Attendance Records",
                History
              )}
            </>
          )}

          {/* =================================
              STUDENT LINKS
          ================================== */}
          {user.role === "student" && (
            <>
              <div className="my-1" />

              {navLink(
                "/my-attendance",
                "My Attendance",
                ClipboardCheck
              )}
            </>
          )}

          <div
            className="
              mx-2
              my-2
              border-t
              border-white/10
            "
          />

          {navLink(
            "/profile",
            "Profile",
            UserRound
          )}
        </nav>
      </div>

      {/* =====================================
          BOTTOM AREA
      ====================================== */}
      <div
        className="
          relative
          shrink-0
          border-t
          border-white/10
          px-4
          pb-4
          pt-3
        "
      >
        {/* Bottom decorative glow */}
        <div
          className="
            pointer-events-none
            absolute
            -bottom-12
            -right-12
            h-36
            w-36
            rounded-full
            bg-teal-300/10
            blur-2xl
          "
        />

        <div className="relative">
          <p
            className="
              mb-3
              truncate
              px-1
              text-xs
              text-teal-100/60
            "
          >
            {user.email}
          </p>

          {/* SIGN OUT */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              group
              relative
              flex
              w-full
              items-center
              gap-3
              overflow-hidden
              rounded-xl
              border
              border-teal-300/30
              bg-white/5
              px-3
              py-2.5
              text-left
              text-sm
              font-medium
              text-white
              transition-all
              duration-300

              hover:border-teal-200/60
              hover:bg-teal-300/15
              hover:shadow-lg
              hover:shadow-black/10

              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {/* Logout hover sweep */}
            <span
              className="
                pointer-events-none
                absolute
                inset-0
                -translate-x-[120%]
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent
                transition-transform
                duration-500
                group-hover:translate-x-[120%]
              "
            />

            {loggingOut ? (
              <>
                <Loader2
                  className="
                    relative
                    z-10
                    h-[18px]
                    w-[18px]
                    animate-spin
                    text-teal-200
                  "
                />

                <span className="relative z-10">
                  Signing Out...
                </span>
              </>
            ) : (
              <>
                <LogOut
                  className="
                    relative
                    z-10
                    h-[18px]
                    w-[18px]
                    text-teal-100
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />

                <span className="relative z-10">
                  Sign Out
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}