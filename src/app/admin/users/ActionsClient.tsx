"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AdminAction = "approve" | "reject" | "soft-delete" | "restore";

export type AdminUser = {
  id: string;
  deletedAt?: string | Date | null;
};

type Props = { user: AdminUser };

export default function ActionsClient({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<AdminAction | null>(null);

  const successText = (action: AdminAction) =>
    action === "approve"
      ? "User approved."
      : action === "reject"
      ? "User rejected (set to SUSPENDED)."
      : action === "soft-delete"
      ? "User soft-deleted."
      : "User restored and approved.";

  async function callAction(action: AdminAction, body?: unknown) {
    setLoading(action);

    const run = async () => {
      const res = await fetch(`/api/admin/users/${user.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      router.refresh();
    };

    const promise = run();

    toast.promise(promise, {
      loading: "Working…",
      success: successText(action),
      error: (err) => err.message || "Action failed",
    });

    promise.finally(() => setLoading(null));
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => callAction("approve")}
        disabled={loading !== null}
        className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={loading === "approve"}
      >
        {loading === "approve" ? "Approving…" : "Approve"}
      </button>

      <button
        onClick={() => callAction("reject", { reason: "Not meeting criteria" })}
        disabled={loading !== null}
        className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={loading === "reject"}
      >
        {loading === "reject" ? "Rejecting…" : "Reject"}
      </button>

      {!user.deletedAt ? (
        <button
          onClick={() => callAction("soft-delete")}
          disabled={loading !== null}
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={loading === "soft-delete"}
        >
          {loading === "soft-delete" ? "Deleting…" : "Delete"}
        </button>
      ) : (
        <button
          onClick={() => callAction("restore")}
          disabled={loading !== null}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={loading === "restore"}
        >
          {loading === "restore" ? "Restoring…" : "Restore"}
        </button>
      )}
    </div>
  );
}
