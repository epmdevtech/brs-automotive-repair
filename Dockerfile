# ==========================================
# Estágio 1: Dependências
# ==========================================
FROM oven/bun:1-slim AS deps
WORKDIR /app

# Copiar manifesto de dependências
COPY package.json bun.lock* ./

# Instalar dependências de forma reprodutível
RUN bun install --frozen-lockfile

# ==========================================
# Estágio 2: Desenvolvimento com Live Reload (HMR)
# ==========================================
FROM oven/bun:1-slim AS dev
WORKDIR /app

ENV NODE_ENV=development
ENV PORT=5210
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true
ENV VITE_USE_POLLING=true
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_INTERVAL=100

COPY package.json bun.lock* ./
RUN bun install

EXPOSE 5210

# Garante sincronização imediata de dependências ao montar volumes e sobe Vite com HMR
CMD ["sh", "-c", "bun install && bun run dev --host 0.0.0.0 --port 5210"]

# ==========================================
# Estágio 3: Compilação de Produção
# ==========================================
FROM oven/bun:1-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Compilação cliente Vite e servidor Nitro
RUN bun run build

# ==========================================
# Estágio 4: Runtime de Produção Mínimo
# ==========================================
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5210
ENV HOST=0.0.0.0

# Copiar artefatos compilados
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 5210

CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "5210", "--strictPort"]
