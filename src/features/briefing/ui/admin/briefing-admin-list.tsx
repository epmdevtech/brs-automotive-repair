import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BRIEFING_STATUSES,
  BRIEFING_STATUS_LABELS,
  type BriefingStatus,
} from "../../domain/status";
import { listAdminBriefings } from "../../server/functions";
import { formatDateTimeUtc } from "../../domain/format";
import { BriefingSignOutButton } from "../briefing-sign-out-button";
import type { BriefingSummary } from "../../server/briefing-service";

export function BriefingAdminList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BriefingStatus | "">("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<BriefingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const result = await listAdminBriefings({
      data: {
        search: search.trim().length > 0 ? search.trim() : undefined,
        status: status === "" ? undefined : status,
        page,
        pageSize: 20,
      },
    });

    if (!result.ok) {
      setErrorMessage(result.error.message);
      setLoading(false);
      return;
    }

    setItems(result.data.items);
    setTotal(result.data.total);
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
            EPM DevTech · Painel administrativo
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            Briefings recebidos
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Levantamentos operacionais enviados pela Master Chapeação e Pinturas. Cada registro é
            gravado com rastreabilidade de status e auditoria.
          </p>
        </div>

        <BriefingSignOutButton />
      </header>

      <section className="mt-5 border border-white/10 bg-white/[0.02] p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-end">
          <div className="space-y-1.5">
            <label htmlFor="briefing-admin-search" className="text-sm font-medium text-neutral-200">
              Buscar por empresa
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
                aria-hidden="true"
              />
              <Input
                id="briefing-admin-search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Ex.: LCL Chapeação"
                className="border-white/15 bg-white/5 pl-9 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="briefing-admin-status" className="text-sm font-medium text-neutral-200">
              Situação
            </label>
            <select
              id="briefing-admin-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as BriefingStatus | "");
                setPage(1);
              }}
              className="flex h-9 w-full rounded-md border border-white/15 bg-white/5 px-3 py-1 text-base text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] md:text-sm"
            >
              <option value="">Todas</option>
              {BRIEFING_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {BRIEFING_STATUS_LABELS[item]}
                </option>
              ))}
            </select>
          </div>

          <Button type="button" variant="secondary" onClick={() => void load()}>
            <RefreshCw aria-hidden="true" />
            Atualizar
          </Button>
        </div>
      </section>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 border border-red-400/30 bg-red-400/5 p-3 text-sm text-red-100"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Lista de briefings recebidos</caption>
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-neutral-500">
              <th scope="col" className="py-2 pr-4">
                Empresa
              </th>
              <th scope="col" className="py-2 pr-4">
                Situação
              </th>
              <th scope="col" className="py-2 pr-4">
                Atualizado em
              </th>
              <th scope="col" className="py-2 pr-4">
                Enviado em
              </th>
              <th scope="col" className="py-2">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-sm text-neutral-500">
                  Carregando briefings…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-sm text-neutral-500">
                  Nenhum briefing encontrado para os filtros aplicados.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-neutral-100">
                    {item.companyName || "Sem nome informado"}
                  </td>
                  <td className="py-3 pr-4 text-neutral-300">
                    {BRIEFING_STATUS_LABELS[item.status]}
                  </td>
                  <td className="py-3 pr-4 text-neutral-400">
                    {formatDateTimeUtc(item.updatedAt)}
                  </td>
                  <td className="py-3 pr-4 text-neutral-400">
                    {item.submittedAt ? formatDateTimeUtc(item.submittedAt) : "—"}
                  </td>
                  <td className="py-3">
                    <Link
                      to="/admin/briefings/$briefingId"
                      params={{ briefingId: item.id }}
                      className="text-[var(--brand-text-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                    >
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="mt-4 flex items-center justify-between text-xs text-neutral-500"
        aria-label="Paginação"
      >
        <span>
          {total} briefing(s) · página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((value) => value + 1)}
          >
            Próxima
          </Button>
        </div>
      </nav>
    </div>
  );
}
