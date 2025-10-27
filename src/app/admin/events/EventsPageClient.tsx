"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useAdminEventActions } from "@/hooks/useAdminEventActions";

export type AdminEventRow = {
  id: string;
  title: string;
  status: "ACTIVE" | "CANCELLED";
  startTime: string | Date;
  endTime: string | Date;
  roomId: string;
  room?: { name: string } | null;
  createdById: string;
  createdBy?: { email: string | null; name: string | null } | null;
};

export default function EventsPageClient({
  events,
  error,
}: {
  events: AdminEventRow[];
  error: string | null;
}) {
  const { cancel, restore, hardDelete, isLoading } = useAdminEventActions();

  useEffect(() => {
    if (error) toast.error("Couldn’t load events", { description: error });
  }, [error]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Events</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Title</th>
            <th className="p-2">Room</th>
            <th className="p-2">When</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created by</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.title}</td>
              <td className="p-2">{e.room?.name ?? e.roomId}</td>
              <td className="p-2">
                {new Date(e.startTime).toLocaleString()} –{" "}
                {new Date(e.endTime).toLocaleString()}
              </td>
              <td className="p-2">{e.status}</td>
              <td className="p-2">
                {e.createdBy?.name ?? e.createdBy?.email ?? e.createdById}
              </td>
              <td className="p-2 flex gap-2">
                {e.status === "ACTIVE" ? (
                  <button
                    onClick={() => cancel(e.id)}
                    disabled={isLoading(e.id)}
                    className="rounded bg-yellow-600 px-2 py-1 text-white disabled:opacity-50"
                  >
                    {isLoading(e.id) ? "Cancelling…" : "Cancel"}
                  </button>
                ) : (
                  <button
                    onClick={() => restore(e.id)}
                    disabled={isLoading(e.id)}
                    className="rounded bg-blue-600 px-2 py-1 text-white disabled:opacity-50"
                  >
                    {isLoading(e.id) ? "Restoring…" : "Restore"}
                  </button>
                )}

                <button
                  onClick={() => hardDelete(e.id)}
                  disabled={isLoading(e.id)}
                  className="rounded bg-red-600 px-2 py-1 text-white disabled:opacity-50"
                >
                  {isLoading(e.id) ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr className="border-t">
              <td className="p-4 text-center text-gray-500" colSpan={6}>
                {error ? "Unable to load events." : "No events found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
