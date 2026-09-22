import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function requireAuth(allowedRoles = []) {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;

  if (!token) {
    return {
      authorized: false,
      status: 401,
      message: "Authentication required",
      user: null,
    };
  }

  const session = await verifyToken(token);

  if (!session?.userId || !session?.role) {
    return {
      authorized: false,
      status: 401,
      message: "Invalid or expired session",
      user: null,
    };
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(session.role)
  ) {
    return {
      authorized: false,
      status: 403,
      message: "You do not have permission to perform this action",
      user: null,
    };
  }

  return {
    authorized: true,
    status: 200,
    message: "Authorized",
    user: {
      userId: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
      teacherId: session.teacherId || null,
      studentId: session.studentId || null,
    },
  };
}