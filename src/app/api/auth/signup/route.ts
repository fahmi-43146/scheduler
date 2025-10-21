// src/app/api/auth/signup/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  console.log("[signup] Handler started");
  try {
    // Log request body (careful with sensitive data)
    const body = await req.json();
    console.log("[signup] Request body received:", {
      email: body.email,
      hasPassword: !!body.password,
      hasName: !!body.name,
    });

    const { email, password, name } = body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    console.log("[signup] Normalized email:", normalizedEmail);

    // Validation checks
    if (!normalizedEmail || !password) {
      console.warn("[signup] Validation failed - missing email/password");
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.warn(
        "[signup] Validation failed - password length:",
        password.length
      );
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Password hashing
    console.log("[signup] Starting password hash");
    let passwordHash;
    try {
      passwordHash = await argon2.hash(password);
      console.log("[signup] Password hashed successfully");
    } catch (hashError) {
      console.error("[signup] Password hashing failed:", hashError);
      throw hashError;
    }

    // Database operation
    console.log("[signup] Attempting database operation");
    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name,
          status: "PENDING",
          role: "USER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
      console.log("[signup] User created successfully:", { userId: user.id });
      return NextResponse.json({ user }, { status: 201 });
    } catch (dbError) {
      console.error("[signup] Database operation failed:", {
        name: dbError.name,
        message: dbError.message,
        code:
          dbError instanceof Prisma.PrismaClientKnownRequestError
            ? dbError.code
            : undefined,
      });

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === "P2002") {
          return NextResponse.json(
            { error: "Email already registered." },
            { status: 409 }
          );
        }
      }
      throw dbError;
    }
  } catch (e) {
    console.error("[signup] Unhandled error:", {
      name: e.name,
      message: e.message,
      stack: e.stack,
    });

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  } finally {
    console.log("[signup] Handler completed");
  }
}