// Limitador simples em memória (janela deslizante). Protege contra abuso básico.
// LIMITAÇÃO: em hospedagem serverless cada instância tem a própria memória; para proteção forte
// use também o firewall/rate limit da plataforma (ex.: Vercel WAF) ou um store compartilhado.
const WINDOW_MS = 60_000;
export const MAX_REQUESTS_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

export function rateLimit(key: string, now: number = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const recent = (hits.get(key) ?? []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every(t => now - t >= WINDOW_MS)) hits.delete(k);
  return { allowed: true, retryAfterSec: 0 };
}
export const __resetRateLimitForTests = () => hits.clear();
