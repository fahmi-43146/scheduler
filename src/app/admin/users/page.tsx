// app/admin/users/page.tsx
import Link from "next/link";
import ActionsClient from "./ActionsClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users`,
    {
      cache: "no-store",
    }
  );
  const { users } = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Email</th>
            <th className="p-2">Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Deleted</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.name ?? "-"}</td>
              <td className="p-2">{u.status}</td>
              <td className="p-2">{u.deletedAt ? "Yes" : "No"}</td>
              <td className="p-2">
                <Actions user={u} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-xs text-gray-500">
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}

// Client component for buttons
function Actions({ user }: { user: any }) {
  return <ActionsClient user={user} />;
}
