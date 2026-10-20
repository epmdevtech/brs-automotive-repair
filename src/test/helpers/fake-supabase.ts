/**
 * Cliente Supabase simulado para os testes de serviço do briefing.
 *
 * Implementa apenas o subconjunto da API usado pelas Server Functions,
 * com armazenamento em memória, para exercitar autorização, revalidação,
 * idempotência e isolamento entre clientes sem depender de rede.
 */
export type FakeRow = Record<string, unknown>;

export interface FakeSupabaseState {
  tables: Record<string, FakeRow[]>;
  user: { id: string; email: string } | null;
  role: "client" | "admin";
  rpcCalls: { name: string; args: Record<string, unknown> }[];
  storageUploads: { bucket: string; path: string; contentType?: string }[];
  signedUrls: { bucket: string; path: string; ttl: number }[];
  storageRemoved: { bucket: string; path: string }[];
  nextId: number;
}

export function createFakeState(): FakeSupabaseState {
  return {
    tables: {
      profiles: [],
      briefings: [],
      briefing_answers: [],
      briefing_files: [],
      briefing_activity: [],
    },
    user: null,
    role: "client",
    rpcCalls: [],
    storageUploads: [],
    signedUrls: [],
    storageRemoved: [],
    nextId: 1,
  };
}

interface Filter {
  kind: "eq" | "ilike" | "gte" | "lte";
  column: string;
  value: unknown;
}

type Mode = "select" | "insert" | "update" | "upsert" | "delete";

class FakeQuery {
  private mode: Mode = "select";
  private filters: Filter[] = [];
  private payload: FakeRow | null = null;
  private orderColumn: string | null = null;
  private orderAscending = true;
  private limitCount: number | null = null;
  private rangeStart: number | null = null;
  private rangeEnd: number | null = null;
  private withCount = false;
  private onConflict: string[] = [];

  constructor(
    private readonly state: FakeSupabaseState,
    private readonly table: string,
  ) {}

  select(_columns?: string, options?: { count?: string }) {
    this.withCount = options?.count === "exact";
    return this;
  }

  insert(payload: FakeRow) {
    this.mode = "insert";
    this.payload = payload;
    return this;
  }

  upsert(payload: FakeRow, options?: { onConflict?: string }) {
    this.mode = "upsert";
    this.payload = payload;
    this.onConflict = (options?.onConflict ?? "").split(",").filter(Boolean);
    return this;
  }

  update(payload: FakeRow) {
    this.mode = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ kind: "eq", column, value });
    return this;
  }

  ilike(column: string, value: unknown) {
    this.filters.push({ kind: "ilike", column, value });
    return this;
  }

  gte(column: string, value: unknown) {
    this.filters.push({ kind: "gte", column, value });
    return this;
  }

  lte(column: string, value: unknown) {
    this.filters.push({ kind: "lte", column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderColumn = column;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(start: number, end: number) {
    this.rangeStart = start;
    this.rangeEnd = end;
    return this;
  }

  async maybeSingle(): Promise<{ data: FakeRow | null; error: null }> {
    const { data } = await this.execute();
    return { data: data.length > 0 ? (data[0] ?? null) : null, error: null };
  }

  async single(): Promise<{ data: FakeRow | null; error: null }> {
    const { data } = await this.execute();
    return { data: data[0] ?? null, error: null };
  }

  then<TResult1 = { data: FakeRow[]; error: null; count?: number }, TResult2 = never>(
    onfulfilled?:
      | ((value: {
          data: FakeRow[];
          error: null;
          count?: number;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled as never, onrejected as never);
  }

  private matches(row: FakeRow): boolean {
    return this.filters.every((filter) => {
      const value = row[filter.column];
      switch (filter.kind) {
        case "eq":
          return value === filter.value;
        case "ilike": {
          const needle = String(filter.value).replace(/%/g, "").toLowerCase();
          return String(value ?? "")
            .toLowerCase()
            .includes(needle);
        }
        case "gte":
          return String(value ?? "") >= String(filter.value);
        case "lte":
          return String(value ?? "") <= String(filter.value);
        default:
          return false;
      }
    });
  }

  private async execute(): Promise<{ data: FakeRow[]; error: null; count?: number }> {
    const table = this.state.tables[this.table] ?? (this.state.tables[this.table] = []);

    switch (this.mode) {
      case "insert": {
        const row = this.withDefaults(this.payload ?? {});
        table.push(row);
        return { data: [row], error: null };
      }
      case "upsert": {
        const payload = this.payload ?? {};
        const conflictColumns =
          this.onConflict.length > 0 ? this.onConflict : ["briefing_id", "section_key"];
        const existing = table.find((row) =>
          conflictColumns.every((column) => row[column] === payload[column]),
        );

        if (existing) {
          Object.assign(existing, payload, { updated_at: new Date().toISOString() });
          return { data: [existing], error: null };
        }

        const row = this.withDefaults(payload);
        table.push(row);
        return { data: [row], error: null };
      }
      case "update": {
        const updated: FakeRow[] = [];
        for (const row of table) {
          if (!this.matches(row)) continue;
          Object.assign(row, this.payload ?? {}, { updated_at: new Date().toISOString() });
          updated.push(row);
        }
        return { data: updated, error: null };
      }
      case "delete": {
        const remaining: FakeRow[] = [];
        const removed: FakeRow[] = [];
        for (const row of table) {
          if (this.matches(row)) removed.push(row);
          else remaining.push(row);
        }
        this.state.tables[this.table] = remaining;
        return { data: removed, error: null };
      }
      default: {
        let rows = table.filter((row) => this.matches(row));

        if (this.orderColumn) {
          const column = this.orderColumn;
          rows = [...rows].sort((a, b) => {
            const left = String(a[column] ?? "");
            const right = String(b[column] ?? "");
            return this.orderAscending ? left.localeCompare(right) : right.localeCompare(left);
          });
        }

        const total = rows.length;

        if (this.rangeStart !== null && this.rangeEnd !== null) {
          rows = rows.slice(this.rangeStart, this.rangeEnd + 1);
        } else if (this.limitCount !== null) {
          rows = rows.slice(0, this.limitCount);
        }

        return { data: rows, error: null, ...(this.withCount ? { count: total } : {}) };
      }
    }
  }

  private withDefaults(row: FakeRow): FakeRow {
    const now = new Date().toISOString();
    return {
      id: `row-${this.state.nextId++}`,
      created_at: now,
      updated_at: now,
      ...row,
    };
  }
}

export interface FakeSupabaseClient {
  from: (table: string) => FakeQuery;
  rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: null; error: null }>;
  auth: {
    getUser: () => Promise<{ data: { user: { id: string; email: string } | null }; error: null }>;
  };
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        body: unknown,
        options?: { contentType?: string },
      ) => Promise<{ error: null }>;
      createSignedUrl: (
        path: string,
        ttl: number,
      ) => Promise<{ data: { signedUrl: string }; error: null }>;
      remove: (paths: string[]) => Promise<{ error: null }>;
    };
  };
}

export function createFakeSupabaseClient(state: FakeSupabaseState): FakeSupabaseClient {
  const client: FakeSupabaseClient = {
    from: (table: string) => new FakeQuery(state, table),
    rpc: async (name: string, args: Record<string, unknown>) => {
      state.rpcCalls.push({ name, args });
      return { data: null, error: null };
    },
    auth: {
      getUser: async () => ({ data: { user: state.user }, error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, _body: unknown, options?: { contentType?: string }) => {
          state.storageUploads.push({ bucket, path, contentType: options?.contentType });
          return { error: null };
        },
        createSignedUrl: async (path: string, ttl: number) => {
          state.signedUrls.push({ bucket, path, ttl });
          return { data: { signedUrl: `https://signed.local/${path}` }, error: null };
        },
        remove: async (paths: string[]) => {
          for (const path of paths) state.storageRemoved.push({ bucket, path });
          return { error: null };
        },
      }),
    },
  };

  return client;
}
