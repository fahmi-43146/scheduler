import { getCurrentUser } from "@/lib/auth";

export default async function Dashboard() {
  const me = await getCurrentUser();
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">
        Welcome{me?.name ? `, ${me.name}` : ""}
      </h1>
      <p className="mt-2">
        Role: {me?.role} · Status: {me?.status}
      </p>
      {me?.status !== "APPROVED" && me?.role !== "ADMIN" ? (
        <p className="mt-3 text-amber-700">
          Your account is pending approval. You can browse but cant create
          events yet.
        </p>
      ) : (
        <p className="mt-3 text-emerald-700">You can create events.</p>
      )}
    </main>
  );
}
