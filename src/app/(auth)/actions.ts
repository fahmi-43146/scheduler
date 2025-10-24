// app/(auth)/actions.ts
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function signOut() {
  const jar = await cookies();
  jar.set(process.env.COOKIE_NAME!, "", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // delete
  });
  redirect("/")
}
