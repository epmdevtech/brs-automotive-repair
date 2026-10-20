import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PHOTO_CATEGORIES } from "../domain/steps";
import type { BriefingPhoto } from "../domain/types";
import { MAX_BRIEFING_PHOTOS } from "./use-briefing-draft";

interface BriefingPhotosPanelProps {
  photos: BriefingPhoto[];
  onAddFiles: (files: File[], categoryId: string) => { added: number; skipped: number };
  onUpdatePhoto: (photoId: string, updates: Partial<BriefingPhoto>) => void;
  onRemovePhoto: (photoId: string) => void;
}

export function BriefingPhotosPanel({
  photos,
  onAddFiles,
  onUpdatePhoto,
  onRemovePhoto,
}: BriefingPhotosPanelProps) {
  const [categoryId, setCategoryId] = useState(PHOTO_CATEGORIES[0]?.id ?? "fachada");
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const category = PHOTO_CATEGORIES.find((item) => item.id === categoryId);
    if (!category) return;

    const result = onAddFiles(files, categoryId);
    const parts = [
      `${result.added} imagem(ns) registrada(s) apenas como metadados.`,
      result.skipped > 0
        ? `${result.skipped} arquivo(s) não foram registrados por limite de quantidade ou tamanho.`
        : "",
      "Nenhum arquivo foi enviado ou armazenado.",
    ].filter(Boolean);
    setMessage(parts.join(" "));

    event.target.value = "";
  }

  return (
    <div className="border border-white/10 bg-white/[0.02] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Acervo de imagens</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {photos.length} de {MAX_BRIEFING_PHOTOS} registros. Arquivos não são enviados.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400">
          somente metadados
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="briefing-photo-category" className="text-sm font-medium text-neutral-200">
            Categoria da imagem
          </label>
          <select
            id="briefing-photo-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="flex h-9 w-full rounded-md border border-white/15 bg-white/5 px-3 py-1 text-base text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] md:text-sm"
          >
            {PHOTO_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            ref={fileInputRef}
            id="briefing-photo-files"
            type="file"
            aria-label="Selecionar arquivos de imagem"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="sr-only"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-center"
          >
            <ImagePlus aria-hidden="true" />
            Selecionar imagens
          </Button>
        </div>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        A seleção apenas registra o nome do arquivo. Para enviar imagens, use um canal seguro
        combinado com a EPM DevTech.
      </p>

      {message ? (
        <p
          role="status"
          className="mt-3 rounded-md border border-white/10 bg-white/5 p-2 text-xs text-neutral-300"
        >
          {message}
        </p>
      ) : null}

      {photos.length === 0 ? (
        <p className="mt-4 border border-dashed border-white/10 p-4 text-sm text-neutral-500">
          Nenhuma imagem registrada. Você pode continuar sem fotos e marcar a pendência
          correspondente.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {photos.map((photo) => (
            <li key={photo.id} className="border border-white/10 bg-neutral-950/40 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{photo.fileName}</p>
                  <p className="text-xs text-neutral-500">
                    {photo.categoryLabel} · {formatBytes(photo.fileSize)}
                    {photo.fileType ? ` · ${photo.fileType}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemovePhoto(photo.id)}
                  aria-label={`Remover registro de ${photo.fileName}`}
                  className="text-neutral-400 hover:text-red-300"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                <label
                  htmlFor={`${photo.id}-description`}
                  className="block text-xs font-medium text-neutral-400"
                >
                  Descrição, se necessária
                </label>
                <Input
                  id={`${photo.id}-description`}
                  value={photo.description}
                  onChange={(event) => onUpdatePhoto(photo.id, { description: event.target.value })}
                  maxLength={2000}
                  placeholder="Ex.: foto da fachada tirada em 2026"
                  className="h-8 border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
                />
              </div>

              <div className="mt-2 flex flex-col gap-2 text-xs text-neutral-400 sm:flex-row sm:gap-5">
                <label className="inline-flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={photo.authorized}
                    onChange={(event) =>
                      onUpdatePhoto(photo.id, { authorized: event.target.checked })
                    }
                    className="mt-0.5 size-3.5 cursor-pointer accent-[var(--brand-primary)]"
                  />
                  Autorizo a avaliação desta imagem para uso futuro
                </label>
                <label className="inline-flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={photo.identifiable}
                    onChange={(event) =>
                      onUpdatePhoto(photo.id, { identifiable: event.target.checked })
                    }
                    className="mt-0.5 size-3.5 cursor-pointer accent-[var(--brand-primary)]"
                  />
                  Contém placa, rosto ou informação identificável
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
