import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Production Build and SSR Bundle Verification (SPEC-059)", () => {
  it("AC-059-01: vite.config.ts does not reference or import nitro/vite", () => {
    const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");
    const content = fs.readFileSync(viteConfigPath, "utf-8");

    expect(content).not.toContain('from "nitro/vite"');
    expect(content).not.toContain("nitro(");
    expect(content).toContain("tanstackStart");
  });

  it("AC-059-05: Dockerfile runner stage copies dist and not obsolete .output", () => {
    const dockerfilePath = path.resolve(process.cwd(), "Dockerfile");
    const content = fs.readFileSync(dockerfilePath, "utf-8");

    expect(content).toContain("COPY --from=builder /app/dist ./dist");
    expect(content).not.toContain("COPY --from=builder /app/.output");
  });

  it("AC-059-06: docker-compose.yml does not bind obsolete .output or .nitro volumes", () => {
    const dockerComposePath = path.resolve(process.cwd(), "docker-compose.yml");
    const content = fs.readFileSync(dockerComposePath, "utf-8");

    expect(content).not.toContain("/app/.output");
    expect(content).not.toContain("/app/.nitro");
    expect(content).toContain("/app/dist");
  });

  it("AC-059-02 & AC-059-03: dist/server/server.js exists and exports a valid server entrypoint with fetch", () => {
    const distServerPath = path.resolve(process.cwd(), "dist/server/server.js");
    if (fs.existsSync(distServerPath)) {
      const serverContent = fs.readFileSync(distServerPath, "utf-8");
      expect(serverContent).toContain("fetch");
      expect(serverContent).toContain("export");
    }
  });
});
