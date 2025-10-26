//src\app\page.tsx
import HomeClient from "@/components/HomeClient";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  return <HomeClient isAdmin={isAdmin} />;
}
