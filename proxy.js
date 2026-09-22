import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  // -----------------------------
  // LOGIN PAGE
  // -----------------------------
  if (pathname === "/login") {
    if (!token) {
      return NextResponse.next();
    }

    const session = await verifyToken(token);

    if (!session) {
      const response = NextResponse.next();
      response.cookies.delete("session");
      return response;
    }

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // -----------------------------
  // USER MUST BE LOGGED IN
  // -----------------------------
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const session = await verifyToken(token);

  if (!session) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("session");

    return response;
  }

  const role = session.role;

  // -----------------------------
  // ADMIN
  // -----------------------------
  // Admin can access all portal pages.
  if (role === "admin") {
    return NextResponse.next();
  }

  // -----------------------------
  // TEACHER
  // -----------------------------
  if (role === "teacher") {
    const teacherAllowedRoutes = [
      "/dashboard",
      "/students",
      "/classes",
      "/attendance",
      "/profile",
      "/assistant",
    ];

    const allowed = teacherAllowedRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

    if (!allowed) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    // Teacher must NOT access student creation.
    if (pathname === "/students/add") {
      return NextResponse.redirect(
        new URL("/students", request.url)
      );
    }

    // Teacher must NOT access student editing.
    if (
      pathname.startsWith("/students/") &&
      pathname.endsWith("/edit")
    ) {
      return NextResponse.redirect(
        new URL("/students", request.url)
      );
    }

    // Teacher must NOT create classes.
    if (pathname === "/classes/add") {
      return NextResponse.redirect(
        new URL("/classes", request.url)
      );
    }

    // Teacher must NOT edit classes.
    if (
      pathname.startsWith("/classes/") &&
      pathname.endsWith("/edit")
    ) {
      return NextResponse.redirect(
        new URL("/classes", request.url)
      );
    }

    return NextResponse.next();
  }

  // -----------------------------
  // STUDENT
  // -----------------------------
  if (role === "student") {
    const studentAllowedRoutes = [
      "/dashboard",
      "/my-attendance",
      "/profile",
      "/assistant",
    ];

    const allowed = studentAllowedRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

    if (!allowed) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  // -----------------------------
  // UNKNOWN ROLE
  // -----------------------------
  const response = NextResponse.redirect(
    new URL("/login", request.url)
  );

  response.cookies.delete("session");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/teachers/:path*",
    "/classes/:path*",
    "/programs/:path*",
    "/subjects/:path*",
    "/attendance/:path*",
    "/reports/:path*",
    "/my-attendance/:path*",
    "/profile/:path*",
    "/assistant/:path*",
    "/login",
  ],
};