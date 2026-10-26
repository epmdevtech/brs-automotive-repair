import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const textExtensions = new Set([
  ".md",
  ".json",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".html",
  ".webmanifest",
]);
const platePatterns = [/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/, /^[A-Z]{3}-?[0-9]{4}$/];
const sourcePlateTokens = [
  [66, 78, 67, 84, 54, 55, 55, 57],
  [66, 80, 76, 66, 49, 57, 52, 49],
  [68, 79, 70, 90, 56, 55, 49, 48],
  [70, 69, 90, 66, 51, 54, 57, 53],
  [67, 73, 75, 69, 57, 48, 56, 57],
  [68, 84, 66, 88, 49, 50, 51, 55],
  [69, 82, 80, 88, 49, 50, 53, 52],
].map((codes) => String.fromCharCode(...codes));

function walk(directory: string): string[] {
  if (!statSync(directory, { throwIfNoEntry: false })) return [];
  return readdirSync(directory).flatMap((entry) => {
    const absolute = path.join(directory, entry);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

describe("Privacidade das imagens publicadas", () => {
  it("não mantém nomes de arquivo com padrão de placa veicular", () => {
    const files = [
      ...walk(path.join(projectRoot, "src/assets")),
      ...walk(path.join(projectRoot, "public")),
      ...walk(path.join(projectRoot, "docs")),
    ];

    const offending = files.filter((file) => {
      const stem = path.basename(file, path.extname(file)).toUpperCase();
      return platePatterns.some((pattern) => pattern.test(stem));
    });

    expect(offending).toEqual([]);
  });

  it("não expõe os identificadores originais das fotos do cliente em arquivos textuais", () => {
    const files = [
      ...walk(path.join(projectRoot, "src")),
      ...walk(path.join(projectRoot, "docs")),
      ...walk(path.join(projectRoot, "public")),
    ].filter((file) => textExtensions.has(path.extname(file).toLowerCase()));

    const hits = files.flatMap((file) => {
      const content = readFileSync(file, "utf8");
      return sourcePlateTokens
        .filter((token) => content.includes(token))
        .map((token) => `${file}:${token}`);
    });

    expect(hits).toEqual([]);
  });

  it("mantém os originais fora das pastas publicadas", () => {
    const publishedFiles = [
      ...walk(path.join(projectRoot, "src/assets")),
      ...walk(path.join(projectRoot, "public")),
    ].map((file) => path.basename(file));

    expect(publishedFiles.some((file) => file.startsWith("original-"))).toBe(false);
  });
});
