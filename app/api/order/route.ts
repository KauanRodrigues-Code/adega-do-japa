// POST /api/order — valida o pedido e RECALCULA preços, taxa e total no servidor.
// Não grava nada, não altera catálogo e não aceita valores monetários do cliente.
import { processOrder } from "@/lib/order";
import { MAX_BODY_BYTES } from "@/lib/orderConfig";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", ...extra },
  });

const fail = (status: number, message: string, extra: Record<string, string> = {}) => json({ ok: false, errors: [message] }, status, extra);

function clientKey(req: Request): string {
  // Atrás de plataforma confiável (ex.: Vercel) estes cabeçalhos são definidos pela infraestrutura.
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0].trim() : req.headers.get("x-real-ip")) || "unknown";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // chamadas fora do navegador não enviam Origin
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function readLimited(req: Request, max: number): Promise<string | null> {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > max) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { all.set(c, off); off += c.byteLength; }
  return new TextDecoder().decode(all);
}

export async function POST(req: Request): Promise<Response> {
  try {
    if (!sameOrigin(req)) return fail(403, "Origem não permitida.");
    const rl = rateLimit(clientKey(req));
    if (!rl.allowed) return fail(429, "Muitas tentativas. Aguarde um minuto e tente novamente.", { "retry-after": String(rl.retryAfterSec) });
    if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return fail(415, "Formato não suportado.");
    const text = await readLimited(req, MAX_BODY_BYTES);
    if (text === null) return fail(413, "Pedido grande demais.");
    let body: unknown;
    try { body = JSON.parse(text); } catch { return fail(400, "Pedido inválido."); }
    const result = processOrder(body);
    if (!result.ok) return json({ ok: false, errors: result.errors }, 422);
    return json({ ok: true, order: result.value });
  } catch {
    return fail(500, "Não foi possível processar o pedido agora. Tente novamente."); // sem detalhes internos
  }
}
