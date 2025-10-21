import { NextResponse } from "next/server";
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
    console.log("[login] Handler started");
    try {
        // Parse request body
        const body = await req.json();
        console.log("[login] Request received for email:", body.email);

        const { email, password } = body;
        if (!email || !password) {
            console.warn("[login] Missing email or password");
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({ 
            where: { email: email.toLowerCase() } 
        });
        
        if (!user) {
            console.warn("[login] User not found:", email);
            return NextResponse.json(
                { error: "Invalid credentials" }, 
                { status: 401 }
            );
        }
        
        // Verify password
        console.log("[login] Verifying password");
        const ok = await argon2.verify(user.passwordHash, password);
        if (!ok) {
            console.warn("[login] Invalid password for user:", email);
            return NextResponse.json(
                { error: "Invalid credentials" }, 
                { status: 401 }
            );
        }
        
        // Generate JWT
        console.log("[login] Generating token");
        const token = jwt.sign(
            { 
                sub: user.id, 
                role: user.role, 
                status: user.status 
            }, 
            process.env.JWT_SECRET!, 
            { expiresIn: "7d" }
        );
        
        // Create response
        const res = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status
            }
        });
        
        // Set cookie
        res.cookies.set(SESSION_COOKIE.name, token, SESSION_COOKIE.options);
        console.log("[login] Success for user:", email);
        return res;

    } catch (error) {
        console.error("[login] Error:", error);
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    } finally {
        console.log("[login] Handler completed");
    }
}