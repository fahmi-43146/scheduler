import Link from "next/link";
import ActionsClient, { type AdminUser } from "./ActionsClient";
import { headers, cookies } from "next/headers";

export const dynamic = "force-dynamic";

type AdminStatus = "PENDING" | "APPROVED" | "SUSPENDED";

type AdminUserRow = AdminUser & {
  email: string;
  name?: string | null;
  status: AdminStatus;
};

type UsersResponse = {
  users: AdminUserRow[];
};

export default async function AdminUsersPage() {
  const h = await headers();
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const host = h.get("host");
  if (!host) throw new Error("Missing Host header");
  const url = `${proto}://${host}/api/admin/users`;

  const c = await cookies();
  const cookieHeader = c
    .getAll()
    .map((ck) => `${ck.name}=${encodeURIComponent(ck.value)}`)
    .join("; ");

  const res = await fetch(url, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!res.ok) {
    let msg = "Failed to load users";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) msg = data.error;
    } catch {}
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Users Management
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage and moderate user accounts
            </p>
          </div>

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{msg}</p>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { users } = (await res.json()) as UsersResponse;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Users Management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and moderate user accounts
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Deleted
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {u.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        u.status === "APPROVED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : u.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {u.deletedAt ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Actions user={u} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No users yet.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Actions({ user }: { user: AdminUser }) {
  return <ActionsClient user={user} />;
}
