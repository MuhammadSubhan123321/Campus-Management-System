"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        setUser(data.user);
      } catch (error) {
        console.error("Fetch profile error:", error);

        setError(
          error.message || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // --------------------------------
  // PROFILE BASED ON USER ROLE
  // --------------------------------

  const profile =
    user.role === "teacher"
      ? user.teacher
      : user.role === "student"
        ? user.student
        : null;

  const displayName =
    profile?.name || user.name || "User";

  const displayEmail =
    profile?.email || user.email || "—";

  const displayPhone =
    profile?.phone || "—";

  const roleLabel = user.role
    ? user.role.charAt(0).toUpperCase() +
      user.role.slice(1)
    : "User";

  // --------------------------------
  // INITIALS
  // --------------------------------

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // --------------------------------
  // STUDENT CLASS
  // --------------------------------

  const studentClass =
    user.role === "student"
      ? user.student?.class
      : null;

  return (
    <div className="mx-auto max-w-6xl">
      {/* PAGE HEADER */}

      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>

          My Account
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Profile
        </h1>

        <p className="mt-2 text-gray-600">
          View your account and personal information.
        </p>
      </div>

      {/* MAIN PROFILE CARD */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* PROFILE HEADER */}

        <div className="border-b border-gray-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 px-6 py-6 md:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* AVATAR */}

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-xl font-bold text-teal-700 ring-4 ring-white shadow-sm">
                {initials || "U"}
              </div>

              {/* NAME */}

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* ROLE BADGE */}

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}

        <div className="p-6 md:p-8">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your basic account and contact details.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* FULL NAME */}

            <InfoCard
              label="Full Name"
              value={displayName}
              type="user"
            />

            {/* EMAIL */}

            <InfoCard
              label="Email Address"
              value={displayEmail}
              type="email"
            />

            {/* ROLE */}

            <InfoCard
              label="Account Role"
              value={roleLabel}
              type="role"
            />

            {/* PHONE */}

            <InfoCard
              label="Phone Number"
              value={displayPhone}
              type="phone"
            />
          </div>

          {/* STUDENT INFORMATION */}

          {user.role === "student" && user.student && (
            <div className="mt-8 border-t border-gray-100 pt-7">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Student Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your academic and guardian information.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SimpleInfo
                  label="Roll Number"
                  value={user.student.rollNumber}
                />

                <SimpleInfo
                  label="Class"
                  value={studentClass?.className}
                />

                <SimpleInfo
                  label="Section"
                  value={studentClass?.section}
                />

                <SimpleInfo
                  label="Gender"
                  value={user.student.gender}
                />

                <SimpleInfo
                  label="Guardian Name"
                  value={user.student.guardianName}
                />

                <SimpleInfo
                  label="Guardian Phone"
                  value={user.student.guardianPhone}
                />

                <SimpleInfo
                  label="Account Status"
                  value={
                    user.student.isActive === false
                      ? "Inactive"
                      : "Active"
                  }
                />
              </div>
            </div>
          )}

          {/* TEACHER INFORMATION */}

          {user.role === "teacher" && user.teacher && (
            <div className="mt-8 border-t border-gray-100 pt-7">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Teacher Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your employment and academic details.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SimpleInfo
                  label="Employee ID"
                  value={user.teacher.employeeId}
                />

                <SimpleInfo
                  label="Specialization"
                  value={user.teacher.specialization}
                />

                <SimpleInfo
                  label="Qualification"
                  value={user.teacher.qualification}
                />

                <SimpleInfo
                  label="Account Status"
                  value={
                    user.teacher.isActive === false
                      ? "Inactive"
                      : "Active"
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------------------------
// ACCOUNT INFO CARD
// --------------------------------

function InfoCard({ label, value, type }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 transition hover:border-gray-300 hover:bg-gray-50">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          type === "email" || type === "phone"
            ? "bg-orange-100 text-orange-600"
            : "bg-teal-100 text-teal-700"
        }`}
      >
        <InfoIcon type={type} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 truncate font-semibold text-gray-900">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// --------------------------------
// EXTRA ROLE INFORMATION
// --------------------------------

function SimpleInfo({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1.5 font-semibold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

// --------------------------------
// ICONS
// --------------------------------

function InfoIcon({ type }) {
  if (type === "email") {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          width="20"
          height="16"
          x="2"
          y="4"
          rx="2"
        />
        <path d="m22 7-10 6L2 7" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }

  if (type === "role") {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}