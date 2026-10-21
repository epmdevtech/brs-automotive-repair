import { isValidCep, onlyDigits } from "./masks";

/**
 * Consulta assistida de CEP (ViaCEP).
 *
 * É um enriquecimento opcional: falha de rede, timeout ou CEP não localizado
 * retornam `null` e nunca bloqueiam o preenchimento manual do endereço.
 */

export interface CepLookupResult {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface CepLookupOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 5000;

export async function lookupCep(
  cep: string,
  options: CepLookupOptions = {},
): Promise<CepLookupResult | null> {
  const digits = onlyDigits(cep);
  if (!isValidCep(digits)) return null;

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) {
      clearTimeout(timer);
      return null;
    }
    options.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const response = await fetchImpl(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      erro?: boolean | string;
      logradouro?: string;
      bairro?: string;
      localidade?: string;
      uf?: string;
    };

    if (payload.erro) return null;
    if (!payload.localidade || !payload.uf) return null;

    return {
      logradouro: payload.logradouro ?? "",
      bairro: payload.bairro ?? "",
      cidade: payload.localidade,
      uf: payload.uf,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
