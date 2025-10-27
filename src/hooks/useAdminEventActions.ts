"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export type Status = "ACTIVE" | "CANCELLED";
export type AdminEventAction = "cancel" | "restore" | "delete";

/** Minimal shape we need for optimistic updates */
export type EventDraft = { id: string; status?: Status };

type UpdateEventsFn<T extends EventDraft> = (fn: (draft: T[]) => void) => void;

export function useAdminEventActions<T extends EventDraft>(opts?: {
  /** Provide this to enable instant UI (optimistic) updates */
  updateEvents?: UpdateEventsFn<T>;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const run = useCallback(
    async (action: AdminEventAction, id: string) => {
      setLoadingId(id);

      // --- optimistic update ---
      let rollback:
        | { kind: "status"; index: number; prev: Status | undefined }
        | { kind: "delete"; index: number; prevItem: T }
        | null = null;

      if (opts?.updateEvents) {
        opts.updateEvents((draft) => {
          const idx = draft.findIndex((e) => e.id === id);
          if (idx < 0) return;

          if (action === "delete") {
            rollback = { kind: "delete", index: idx, prevItem: draft[idx] };
            draft.splice(idx, 1);
          } else {
            rollback = {
              kind: "status",
              index: idx,
              prev: draft[idx].status as Status | undefined,
            };
            draft[idx] = {
              ...draft[idx],
              status: action === "cancel" ? "CANCELLED" : "ACTIVE",
            };
          }
        });
      }

      const method = action === "delete" ? "DELETE" : "POST";
      const path =
        action === "delete"
          ? `/api/admin/events/${id}`
          : `/api/admin/events/${id}/${action}`;

      const label =
        action === "cancel"
          ? { loading: "Cancelling…", success: "Event cancelled." }
          : action === "restore"
          ? { loading: "Restoring…", success: "Event restored." }
          : { loading: "Deleting…", success: "Event deleted." };

      try {
        await toast.promise(
          (async () => {
            const res = await fetch(path, { method });
            if (!res.ok) {
              const data = await res.json().catch(() => ({} as { error?: string }));
              throw new Error(data?.error ?? `Request failed (${res.status})`);
            }
          })(),
          {
            loading: label.loading,
            success: label.success,
            error: (e) => (e as Error).message || "Action failed",
          }
        );
        // No router.refresh() here — optimistic updates already applied.
      } catch (err) {
        // rollback on error
        if (opts?.updateEvents && rollback) {
          opts.updateEvents((draft) => {
            if (rollback?.kind === "status") {
              const i = rollback.index;
              if (draft[i]) draft[i] = { ...draft[i], status: rollback.prev };
            } else if (rollback?.kind === "delete") {
              // reinsert item at same index
              draft.splice(rollback.index, 0, rollback.prevItem);
            }
          });
        }
        throw err;
      } finally {
        setLoadingId(null);
      }
    },
    [opts]
  );

  const cancel = useCallback((id: string) => run("cancel", id), [run]);
  const restore = useCallback((id: string) => run("restore", id), [run]);
  const hardDelete = useCallback((id: string) => run("delete", id), [run]);

  const isLoading = useCallback(
    (id?: string) => (id ? loadingId === id : loadingId !== null),
    [loadingId]
  );

  return { cancel, restore, hardDelete, isLoading, loadingId };
}
