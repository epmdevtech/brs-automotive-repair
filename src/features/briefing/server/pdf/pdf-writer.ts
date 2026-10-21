/**
 * Escritor de PDF 1.4 sem dependência externa (ADR-003).
 *
 * Suporta o necessário para documentos internos: texto com as fontes padrão
 * (Helvetica, Helvetica-Bold, Courier), codificação WinAnsi/CP1252 para
 * preservar a acentuação do português, linhas e retângulos, paginação e
 * tabelas simples com quebra de linha.
 */

export type PdfFont = "regular" | "bold" | "mono";

export interface PdfPageSize {
  width: number;
  height: number;
}

export const A4: PdfPageSize = { width: 595.28, height: 841.89 };

export interface PdfTextOptions {
  size?: number;
  font?: PdfFont;
  color?: [number, number, number];
  /** Espaçamento entre linhas em pontos. */
  lineHeight?: number;
}

/** Mapa dos caracteres de CP1252 que diferem de Latin-1. */
const CP1252_SPECIALS: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

export function encodeWinAnsi(value: string): Buffer {
  const bytes: number[] = [];

  for (const char of value) {
    const code = char.codePointAt(0) ?? 63;

    if (code < 0x80) {
      bytes.push(code);
      continue;
    }

    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    const special = CP1252_SPECIALS[code];
    if (special !== undefined) {
      bytes.push(special);
      continue;
    }

    // Caracteres fora do CP1252 viram "?" — o documento nunca é quebrado por isso.
    bytes.push(0x3f);
  }

  return Buffer.from(bytes);
}

function escapePdfString(value: string): string {
  return encodeWinAnsi(value)
    .toString("latin1")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export interface PdfTableColumn {
  /** Largura da coluna em pontos. */
  width: number;
  align?: "left" | "right";
}

/**
 * Documento em construção. As páginas são compostas em memória e o arquivo é
 * serializado ao final, com o `xref` calculado sobre o buffer final.
 */
export class PdfDocument {
  private readonly pageSize: PdfPageSize;
  /** Margem lateral e superior do documento, em pontos. */
  readonly margin: number;
  private readonly pages: string[] = [];
  private current: string[] = [];
  /** Posição vertical atual do cursor de escrita. */
  cursorY: number;
  private pageNumber = 0;
  private footerRenderer: ((pageNumber: number) => string) | null = null;

  constructor(options: { pageSize?: PdfPageSize; margin?: number } = {}) {
    this.pageSize = options.pageSize ?? A4;
    this.margin = options.margin ?? 42;
    this.cursorY = this.pageSize.height - this.margin;
  }

  get width(): number {
    return this.pageSize.width;
  }

  get contentWidth(): number {
    return this.pageSize.width - this.margin * 2;
  }

  get pageCount(): number {
    return this.pages.length + (this.current.length > 0 ? 1 : 0);
  }

  get y(): number {
    return this.cursorY;
  }

  /** Define o texto de rodapé aplicado ao final de cada página. */
  setFooter(renderer: (pageNumber: number) => string): void {
    this.footerRenderer = renderer;
  }

  addPage(): void {
    this.finalizePage();
    this.cursorY = this.pageSize.height - this.margin;
  }

  private finalizePage(): void {
    this.pageNumber += 1;

    if (this.footerRenderer) {
      const label = this.footerRenderer(this.pageNumber);
      this.current.push(
        `BT 0.45 0.45 0.5 rg /F1 8 Tf ${this.margin} ${(this.margin - 16).toFixed(2)} Td (${escapePdfString(
          label,
        )}) Tj ET`,
      );
    }

    if (this.current.length > 0) {
      this.pages.push(this.current.join("\n"));
    }

    this.current = [];
  }

  private ensureSpace(height: number): void {
    if (this.cursorY - height < this.margin) {
      this.addPage();
    }
  }

  private color(color: [number, number, number] | undefined): string {
    const [r, g, b] = color ?? [0, 0, 0];
    return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
  }

  text(value: string, x: number, y: number, options: PdfTextOptions = {}): void {
    const size = options.size ?? 10;
    const font = options.font ?? "regular";
    const resource = font === "bold" ? "/F2" : font === "mono" ? "/F3" : "/F1";

    this.current.push(
      `BT ${this.color(options.color)} rg /${resource} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfString(value)}) Tj ET`,
    );
  }

  /** Escreve texto com quebra automática, respeitando a largura útil. */
  paragraph(value: string, options: PdfTextOptions & { x?: number; width?: number } = {}): void {
    const size = options.size ?? 10;
    const lineHeight = options.lineHeight ?? size * 1.35;
    const x = options.x ?? this.margin;
    const width = options.width ?? this.contentWidth;

    for (const line of wrapText(value, size, width)) {
      this.ensureSpace(lineHeight);
      this.cursorY -= lineHeight;
      this.text(line, x, this.cursorY, options);
    }
  }

  /** Escreve um par rótulo/valor com quebra na coluna de valor. */
  keyValue(
    key: string,
    value: string,
    options: {
      x?: number;
      keyWidth?: number;
      width?: number;
      size?: number;
      color?: [number, number, number];
    } = {},
  ): void {
    const size = options.size ?? 9.5;
    const x = options.x ?? this.margin;
    const keyWidth = options.keyWidth ?? 200;
    const width = options.width ?? this.contentWidth - keyWidth - 8;
    const lineHeight = size * 1.32;

    const valueLines = wrapText(value, size, width);
    const keyLines = wrapText(key, size, keyWidth - 8);
    const total = Math.max(valueLines.length, keyLines.length);

    this.ensureSpace(total * lineHeight);

    for (let index = 0; index < total; index += 1) {
      this.cursorY -= lineHeight;
      const keyLine = keyLines[index];
      const valueLine = valueLines[index];

      if (keyLine !== undefined) {
        this.text(keyLine, x, this.cursorY, { size, color: [0.45, 0.45, 0.5] });
      }
      if (valueLine !== undefined) {
        this.text(valueLine, x + keyWidth, this.cursorY, {
          size,
          color: options.color ?? [0.05, 0.05, 0.06],
        });
      }
    }
  }

  heading(
    value: string,
    options: { size?: number; color?: [number, number, number]; spaceBefore?: number } = {},
  ): void {
    const size = options.size ?? 13;
    this.ensureSpace(size * 2.2 + (options.spaceBefore ?? 8));
    this.cursorY -= options.spaceBefore ?? 8;
    this.cursorY -= size;
    this.text(value, this.margin, this.cursorY, {
      size,
      font: "bold",
      color: options.color ?? [0.1, 0.1, 0.12],
    });
  }

  rule(color: [number, number, number] = [0.85, 0.85, 0.88], width = 0.6): void {
    this.ensureSpace(6);
    this.cursorY -= 4;
    this.current.push(
      `${this.color(color)} RG ${width} w ${this.margin} ${this.cursorY.toFixed(2)} m ${(this.pageSize.width - this.margin).toFixed(2)} ${this.cursorY.toFixed(2)} l S`,
    );
  }

  /** Faixa destacada com fundo e texto. */
  callout(
    value: string,
    options: {
      size?: number;
      background?: [number, number, number];
      border?: [number, number, number];
    } = {},
  ): void {
    const size = options.size ?? 8.5;
    const background = options.background ?? [0.96, 0.95, 0.85];
    const border = options.border ?? [0.85, 0.82, 0.55];
    const padding = 6;
    const lines = wrapText(value, size, this.contentWidth - padding * 2);
    const lineHeight = size * 1.35;
    const height = lines.length * lineHeight + padding * 2;

    this.ensureSpace(height + 6);
    const top = this.cursorY;

    this.current.push(
      `${this.color(background)} rg ${this.margin} ${(top - height).toFixed(2)} ${this.contentWidth} ${height} re f`,
    );
    this.current.push(
      `${this.color(border)} RG 0.8 w ${this.margin} ${(top - height).toFixed(2)} ${this.contentWidth} ${height} re S`,
    );

    let cursor = top - padding - lineHeight + 2;
    for (const line of lines) {
      this.text(line, this.margin + padding, cursor, { size, color: [0.25, 0.24, 0.1] });
      cursor -= lineHeight;
    }

    this.cursorY = top - height - 6;
  }

  /** Serializa o documento em bytes de PDF. */
  build(): Buffer {
    this.finalizePage();

    const pageCount = Math.max(this.pages.length, 1);
    const objects: string[] = [];
    const pageObjectIds: number[] = [];

    // 1 catálogo, 2 páginas, 3..5 fontes, a partir de 6: páginas e conteúdos.
    const firstPageId = 6;
    const firstContentId = 6 + pageCount * 2;

    for (let index = 0; index < pageCount; index += 1) {
      pageObjectIds.push(firstPageId + index * 2);
    }

    const kids = pageObjectIds.map((id) => `${id} 0 R`).join(" ");

    objects.push("<< /Type /Catalog /Pages 2 0 R >>");
    objects.push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);
    objects.push(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    );
    objects.push(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    );
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>");

    for (let index = 0; index < pageCount; index += 1) {
      const pageId = firstPageId + index * 2;
      const contentId = firstPageId + index * 2 + 1;
      const content = this.pages[index] ?? "";

      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.pageSize.width.toFixed(2)} ${this.pageSize.height.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentId} 0 R >>`,
      );
      objects.push(
        `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
      );
      void contentId;
    }

    let output = "%PDF-1.4\n";
    const offsets: number[] = [];

    objects.forEach((body, index) => {
      offsets.push(Buffer.byteLength(output, "latin1"));
      output += `${index + 1} 0 obj\n${body}\nendobj\n`;
    });

    const xrefOffset = Buffer.byteLength(output, "latin1");
    output += `xref\n0 ${objects.length + 1}\n`;
    output += "0000000000 65535 f \n";
    for (const offset of offsets) {
      output += `${offset.toString().padStart(10, "0")} 00000 n \n`;
    }
    output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(output, "latin1");
  }
}

/** Largura aproximada de um texto em Helvetica (unidades de 1/1000 em). */
const HELVETICA_WIDTHS: Record<string, number> = {
  " ": 278,
  "!": 278,
  '"': 355,
  "#": 556,
  $: 556,
  "%": 889,
  "&": 667,
  "'": 191,
  "(": 333,
  ")": 333,
  "*": 389,
  "+": 584,
  ",": 278,
  "-": 333,
  ".": 278,
  "/": 278,
  "0": 556,
  "1": 556,
  "2": 556,
  "3": 556,
  "4": 556,
  "5": 556,
  "6": 556,
  "7": 556,
  "8": 556,
  "9": 556,
  ":": 278,
  ";": 278,
  "<": 584,
  "=": 584,
  ">": 584,
  "?": 556,
  "@": 1015,
  A: 667,
  B: 667,
  C: 722,
  D: 722,
  E: 667,
  F: 611,
  G: 778,
  H: 722,
  I: 278,
  J: 500,
  K: 667,
  L: 556,
  M: 833,
  N: 722,
  O: 778,
  P: 667,
  Q: 778,
  R: 722,
  S: 667,
  T: 611,
  U: 722,
  V: 667,
  W: 944,
  X: 667,
  Y: 667,
  Z: 611,
  "[": 278,
  "\\": 278,
  "]": 278,
  "^": 469,
  _: 556,
  "`": 333,
  a: 556,
  b: 556,
  c: 500,
  d: 556,
  e: 556,
  f: 278,
  g: 556,
  h: 556,
  i: 222,
  j: 222,
  k: 500,
  l: 222,
  m: 833,
  n: 556,
  o: 556,
  p: 556,
  q: 556,
  r: 333,
  s: 500,
  t: 278,
  u: 556,
  v: 500,
  w: 722,
  x: 500,
  y: 500,
  z: 500,
  "{": 334,
  "|": 260,
  "}": 334,
  "~": 584,
};

export function measureText(value: string, size: number): number {
  let total = 0;

  for (const char of value) {
    if (char === "\n") continue;
    const width = HELVETICA_WIDTHS[char] ?? 556;
    total += width;
  }

  return (total / 1000) * size;
}

/** Quebra o texto em linhas que cabem na largura informada. */
export function wrapText(value: string, size: number, maxWidth: number): string[] {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length === 0) return [""];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line.length === 0 ? word : `${line} ${word}`;
    if (measureText(candidate, size) <= maxWidth || line.length === 0) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }

  if (line.length > 0) lines.push(line);
  return lines;
}
