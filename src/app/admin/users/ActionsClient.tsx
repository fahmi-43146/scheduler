// app/admin/users/ActionsClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ActionsClient({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function call(path: string, body?: any) {
    setLoading(path);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? "Action failed");
      } else {
        router.refresh(); // RSC re-render
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => call(`/api/admin/users/${user.id}/approve`)}
        disabled={loading !== null}
        className="rounded bg-green-600 px-2 py-1 text-white disabled:opacity-50"
      >
        {loading?.includes("approve") ? "Approving…" : "Approve"}
      </button>

      <button
        onClick={() =>
          call(`/api/admin/users/${user.id}/reject`, {
            reason: "Not meeting criteria",
          })
        }
        disabled={loading !== null}
        className="rounded bg-yellow-600 px-2 py-1 text-white disabled:opacity-50"
      >
        {loading?.includes("reject") ? "Rejecting…" : "Reject"}
      </button>

      {!user.deletedAt ? (
        <button
          onClick={() => call(`/api/admin/users/${user.id}/soft-delete`)}
          disabled={loading !== null}
          className="rounded bg-red-600 px-2 py-1 text-white disabled:opacity-50"
        >
          {loading?.includes("soft-delete") ? "Deleting…" : "Soft delete"}
        </button>
      ) : (
        <button
          onClick={() => call(`/api/admin/users/${user.id}/restore`)}
          disabled={loading !== null}
          className="rounded bg-blue-600 px-2 py-1 text-white disabled:opacity-50"
        >
          {loading?.includes("restore") ? "Restoring…" : "Restore"}
        </button>
      )}
    </div>
  );
}
