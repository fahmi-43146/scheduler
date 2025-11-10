// app/admin/users/page.tsx
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
type UsersResponse = { users: AdminUserRow[] };

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

  // ──────────────────────────────────────────────────────────────
  // ERREUR
  // ──────────────────────────────────────────────────────────────
  if (!res.ok) {
    let msg = "Impossible de charger les utilisateurs";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) msg = data.error;
    } catch {}
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-foreground">
            Gestion des utilisateurs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérer et modérer les comptes utilisateurs
          </p>

          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{msg}</p>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              Retour à l&#39;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { users } = (await res.json()) as UsersResponse;

  // ──────────────────────────────────────────────────────────────
  // SUCCÈS – UI RESPONSIVE
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestion des utilisateurs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérer et modérer les comptes utilisateurs
          </p>
        </div>

        {/* Mobile : cartes */}
        <div className="space-y-4 sm:hidden">
          {users.map((u) => (
            <UserCard key={u.id} user={u} />
          ))}
          {users.length === 0 && <EmptyCard />}
        </div>

        {/* Desktop : tableau */}
        <div className="hidden sm:block overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Supprimé
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {u.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {u.deletedAt ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Actions user={u} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Aucun utilisateur pour le moment.
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
            Retour à l&#39;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPOSANTS RÉUTILISABLES
// ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AdminStatus }) {
  const colors = {
    APPROVED:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  const labels = {
    APPROVED: "Approuvé",
    SUSPENDED: "Suspendu",
    PENDING: "En attente",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function UserCard({ user }: { user: AdminUserRow }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {user.email}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {user.name ?? "—"}
          </p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Supprimé&nbsp;: {user.deletedAt ? "Oui" : "Non"}</span>
        <div className="flex-shrink-0">
          <Actions user={user} />
        </div>
      </div>
    </div>
  );
}

function EmptyCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Aucun utilisateur pour le moment.
      </p>
    </div>
  );
}

function Actions({ user }: { user: AdminUser }) {
  return <ActionsClient user={user} />;
}
