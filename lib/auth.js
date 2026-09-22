import { SignJWT, jwtVerify } from "jose";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return new TextEncoder().encode(secret);
}

export async function createToken(user) {
  return await new SignJWT({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,

    teacherId: user.teacher
      ? user.teacher.toString()
      : null,

    studentId: user.student
      ? user.student.toString()
      : null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecretKey());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey()
    );

    return payload;
  } catch {
    return null;
  }
}