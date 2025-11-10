"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useAdminEventActions } from "@/hooks/useAdminEventActions";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const router = useRouter();
  const { cancel, restore, hardDelete, isLoading } = useAdminEventActions();

  const handleAction = async (
    fn: (id: string) => Promise<void>,
    id: string
  ) => {
    await fn(id);
    router.refresh();
  };

  useEffect(() => {
    if (error)
      toast.error("Impossible de charger les événements", {
        description: error,
      });
  }, [error]);

  const StatusBadge = ({ status }: { status: "ACTIVE" | "CANCELLED" }) => (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "ACTIVE"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      }`}
    >
      {status === "ACTIVE" ? "Actif" : "Annulé"}
    </span>
  );

  const ActionButtons = ({ e }: { e: AdminEventRow }) => (
    <div className="flex gap-1.5">
      {e.status === "ACTIVE" ? (
        <button
          onClick={() => handleAction(cancel, e.id)}
          disabled={isLoading(e.id)}
          className="rounded bg-yellow-600 px-2 py-1 text-xs text-white disabled:opacity-50"
        >
          {isLoading(e.id) ? "…" : "Annuler"}
        </button>
      ) : (
        <button
          onClick={() => handleAction(restore, e.id)}
          disabled={isLoading(e.id)}
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white disabled:opacity-50"
        >
          {isLoading(e.id) ? "…" : "Restaurer"}
        </button>
      )}

      <button
        onClick={() => handleAction(hardDelete, e.id)}
        disabled={isLoading(e.id)}
        className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50"
      >
        {isLoading(e.id) ? "…" : "Supprimer"}
      </button>
    </div>
  );

  const formatWhen = (start: string | Date, end: string | Date) => {
    const s = new Date(start);
    const e = new Date(end);
    const sameDay = s.toDateString() === e.toDateString();
    const fmt = sameDay ? "HH:mm" : "d MMM, HH:mm";
    return `${format(s, fmt, { locale: fr })} – ${format(e, fmt, {
      locale: fr,
    })}`;
  };

  const MobileCards = () => (
    <div className="space-y-3">
      {events.map((e) => (
        <div
          key={e.id}
          className="rounded-lg border border-border bg-card p-3 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">
              {e.title}
            </h3>
            <StatusBadge status={e.status} />
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Salle&nbsp;:</span>{" "}
              {e.room?.name ?? e.roomId}
            </div>
            <div>
              <span className="font-medium">Quand&nbsp;?</span>{" "}
              {formatWhen(e.startTime, e.endTime)}
            </div>
            <div>
              <span className="font-medium">Créé par&nbsp;:</span>{" "}
              {e.createdBy?.name ?? e.createdBy?.email ?? e.createdById}
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <ActionButtons e={e} />
          </div>
        </div>
      ))}

      {events.length === 0 && <EmptyMessage />}
    </div>
  );

  const DesktopTable = () => (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Nom de l&#39;événement
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Salle
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quand&nbsp;?
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Statut
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Créé par&nbsp;:
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Opérations
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {events.map((e) => (
            <tr key={e.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-3 py-2 text-sm text-foreground">{e.title}</td>
              <td className="px-3 py-2 text-sm text-foreground">
                {e.room?.name ?? e.roomId}
              </td>
              <td className="px-3 py-2 text-sm text-foreground">
                {formatWhen(e.startTime, e.endTime)}
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={e.status} />
              </td>
              <td className="px-3 py-2 text-sm text-foreground">
                {e.createdBy?.name ?? e.createdBy?.email ?? e.createdById}
              </td>
              <td className="px-3 py-2">
                <ActionButtons e={e} />
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-3 py-8 text-center text-sm text-muted-foreground"
              >
                {error
                  ? "Impossible de charger les événements."
                  : "Aucun événement trouvé."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const EmptyMessage = () => (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {error
          ? "Impossible de charger les événements."
          : "Aucun événement trouvé."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-5 text-2xl font-bold tracking-tight text-foreground">
          Événements
        </h1>

        <div className="sm:hidden">
          {events.length > 0 ? <MobileCards /> : <EmptyMessage />}
        </div>

        <div className="hidden sm:block">
          {events.length > 0 ? <DesktopTable /> : <EmptyMessage />}
        </div>
      </div>
    </div>
  );
}
