// ============================================================
//  LÓGICA DE PEDIDO — roda NO SERVIDOR (app/api/order/route.ts).
//  Recebe só ids + quantidades + dados do cliente. Preços, taxa e total vêm do catálogo oficial.
//  Qualquer preço/total/taxa enviado pelo navegador é ignorado.
// ============================================================
import { formatBRL, getItem } from "./menu";
import { wa } from "./data";
import {
  DELIVERY_FEE_CENTS, FULFILLMENTS, FULFILLMENT_LABEL, MAX_LINES, MAX_QTY_PER_ITEM, MAX_UNITS, PAYMENTS, PAYMENT_LABEL,
  type Fulfillment, type Payment,
} from "./orderConfig";

export type ParsedOrder = {
  items: { id: string; qty: number }[];
  fulfillment: Fulfillment;
  payment: Payment;
  customer: { name: string; phone: string };
  address?: { street: string; number: string; complement?: string; reference?: string };
  changeForCents?: number;
  notes?: string;
  ignoredClientFields: string[];
};
export type PricedLine = { id: string; name: string; unitCents: number; qty: number; lineCents: number };
export type PricedOrder = {
  lines: PricedLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  fulfillment: Fulfillment;
  payment: Payment;
  changeForCents?: number;
  message: string;
  whatsappUrl: string;
  ignoredClientFields: string[];
};
export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const own = (o: Record<string, unknown>, k: string): unknown => (Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined);
const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === "string" && (list as readonly string[]).includes(v);

// Campos monetários que o cliente poderia tentar enviar. Nunca são lidos; só registrados como "ignorados".
const MONEY_KEYS = ["price", "unitPrice", "subtotal", "total", "totalCents", "fee", "deliveryFee", "taxa", "frete", "discount", "desconto"];

// Remove controles, quebras de linha, caracteres invisíveis/bidi e marcadores de formatação do WhatsApp (* _ ~ `)
// para que texto do cliente não consiga forjar linhas como "TOTAL" na mensagem.
// eslint-disable-next-line no-control-regex
const STRIP = /[\u0000-\u001F\u007F-\u009F​-‏‪-‮⁠-⁩﻿*_~`]/g;
export function cleanText(v: unknown): string | null {
  return typeof v === "string" ? v.replace(STRIP, " ").replace(/\s+/g, " ").trim() : null;
}

function normalizePhone(v: unknown): string | null {
  if (typeof v !== "string" || v.length > 30) return null;
  let d = v.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2);
  if (!/^[1-9]{2}(9\d{8}|\d{8})$/.test(d)) return null;
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
}

function parseMoneyToCents(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) && v > 0 && v <= 10000 ? Math.round(v * 100) : null;
  if (typeof v !== "string") return null;
  const s = v.replace(/R\$|\s/gi, "");
  if (!/^\d{1,5}([.,]\d{1,2})?$/.test(s)) return null;
  const cents = Math.round(parseFloat(s.replace(",", ".")) * 100);
  return cents > 0 && cents <= 1_000_000 ? cents : null;
}

export function parseOrder(raw: unknown): Result<ParsedOrder> {
  if (!isObj(raw)) return { ok: false, errors: ["Pedido inválido."] };
  const errors: string[] = [];
  const ignored = new Set<string>();
  for (const k of MONEY_KEYS) if (own(raw, k) !== undefined) ignored.add(k);

  // --- itens ---
  const items: { id: string; qty: number }[] = [];
  const rawItems = own(raw, "items");
  if (!Array.isArray(rawItems) || rawItems.length === 0) errors.push("Adicione ao menos um produto ao pedido.");
  else if (rawItems.length > MAX_LINES) errors.push("Há itens demais no pedido.");
  else {
    const seen = new Set<string>();
    let units = 0;
    for (const it of rawItems) {
      if (!isObj(it)) { errors.push("Item inválido."); continue; }
      for (const k of MONEY_KEYS) if (own(it, k) !== undefined) ignored.add(`items.${k}`);
      const id = own(it, "id");
      const qty = own(it, "qty");
      if (typeof id !== "string" || !/^[a-z0-9-]{1,40}$/.test(id)) { errors.push("Produto inválido."); continue; }
      const product = getItem(id);
      if (!product) { errors.push(`Produto não encontrado: ${id}.`); continue; }
      if (product.available === false) { errors.push(`Produto indisponível: ${product.name}.`); continue; }
      if (seen.has(id)) { errors.push(`Produto repetido no pedido: ${product.name}.`); continue; }
      seen.add(id);
      if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) {
        errors.push(`Quantidade inválida para ${product.name} (use um número inteiro de 1 a ${MAX_QTY_PER_ITEM}).`);
        continue;
      }
      units += qty;
      items.push({ id, qty });
    }
    if (units > MAX_UNITS) errors.push(`O pedido pode ter no máximo ${MAX_UNITS} unidades.`);
  }

  // --- modalidade e pagamento ---
  const fulfillment = own(raw, "fulfillment");
  if (!isOneOf(FULFILLMENTS, fulfillment)) errors.push("Escolha entrega ou retirada.");
  const payment = own(raw, "payment");
  if (!isOneOf(PAYMENTS, payment)) errors.push("Escolha uma forma de pagamento válida.");
  if (own(raw, "ageConfirmed") !== true) errors.push("É necessário confirmar que você tem 18 anos ou mais.");

  // --- cliente ---
  let name: string | null = null;
  let phone: string | null = null;
  const customer = own(raw, "customer");
  if (!isObj(customer)) errors.push("Informe seu nome e telefone.");
  else {
    name = cleanText(own(customer, "name"));
    if (name === null || name.length < 2 || name.length > 60) { errors.push("Informe um nome válido (2 a 60 caracteres)."); name = null; }
    phone = normalizePhone(own(customer, "phone"));
    if (phone === null) errors.push("Informe um telefone válido com DDD.");
  }

  // --- endereço (só entrega) ---
  let address: ParsedOrder["address"];
  if (fulfillment === "entrega") {
    const a = own(raw, "address");
    if (!isObj(a)) errors.push("Informe o endereço de entrega.");
    else {
      const street = cleanText(own(a, "street"));
      const number = cleanText(own(a, "number"));
      const complement = own(a, "complement") === undefined ? "" : cleanText(own(a, "complement"));
      const reference = own(a, "reference") === undefined ? "" : cleanText(own(a, "reference"));
      let ok = true;
      if (street === null || street.length < 3 || street.length > 80) { errors.push("Informe o endereço (3 a 80 caracteres)."); ok = false; }
      if (number === null || number.length < 1 || number.length > 10) { errors.push("Informe o número do endereço."); ok = false; }
      if (complement === null || complement.length > 40) { errors.push("Complemento muito longo (máx. 40)."); ok = false; }
      if (reference === null || reference.length > 80) { errors.push("Referência muito longa (máx. 80)."); ok = false; }
      if (ok) address = { street: street as string, number: number as string, complement: complement || undefined, reference: reference || undefined };
    }
  }

  // --- troco (só dinheiro) ---
  let changeForCents: number | undefined;
  const rawChange = own(raw, "changeFor");
  if (payment === "dinheiro" && rawChange !== undefined && rawChange !== null && rawChange !== "") {
    const cents = parseMoneyToCents(rawChange);
    if (cents === null) errors.push("Valor para troco inválido.");
    else changeForCents = cents;
  }

  // --- observações ---
  let notes: string | undefined;
  const rawNotes = own(raw, "notes");
  if (rawNotes !== undefined && rawNotes !== null && rawNotes !== "") {
    const n = cleanText(rawNotes);
    if (n === null || n.length > 200) errors.push("Observações inválidas (máx. 200 caracteres).");
    else if (n) notes = n;
  }

  if (errors.length > 0 || !isOneOf(FULFILLMENTS, fulfillment) || !isOneOf(PAYMENTS, payment) || name === null || phone === null) {
    return { ok: false, errors: errors.length ? errors : ["Pedido inválido."] };
  }
  return { ok: true, value: { items, fulfillment, payment, customer: { name, phone }, address, changeForCents, notes, ignoredClientFields: [...ignored] } };
}

export function priceOrder(p: ParsedOrder): Result<PricedOrder> {
  const lines: PricedLine[] = [];
  for (const { id, qty } of p.items) {
    const product = getItem(id);
    if (!product || product.available === false) return { ok: false, errors: ["Produto indisponível."] };
    lines.push({ id, name: product.name, unitCents: product.price, qty, lineCents: product.price * qty });
  }
  const subtotalCents = lines.reduce((s, l) => s + l.lineCents, 0);
  const deliveryFeeCents = p.fulfillment === "entrega" ? DELIVERY_FEE_CENTS : 0;
  const totalCents = subtotalCents + deliveryFeeCents;
  if (p.changeForCents !== undefined && p.changeForCents < totalCents) {
    return { ok: false, errors: [`O valor para troco deve ser igual ou maior que o total do pedido (${formatBRL(totalCents)}).`] };
  }
  const message = buildMessage(p, lines, subtotalCents, deliveryFeeCents, totalCents);
  return {
    ok: true,
    value: {
      lines, subtotalCents, deliveryFeeCents, totalCents, fulfillment: p.fulfillment, payment: p.payment,
      changeForCents: p.changeForCents, message, whatsappUrl: wa(message), ignoredClientFields: p.ignoredClientFields,
    },
  };
}

function buildMessage(p: ParsedOrder, lines: PricedLine[], subtotal: number, fee: number, total: number): string {
  const out: string[] = [];
  out.push("Olá! Gostaria de fazer um pedido na Adega do Japa.", "", "*MEU PEDIDO:*");
  for (const l of lines) out.push(`${l.qty}x ${l.name} (${formatBRL(l.unitCents)} un.) — ${formatBRL(l.lineCents)}`);
  out.push("", `*Subtotal:* ${formatBRL(subtotal)}`);
  if (p.fulfillment === "entrega") out.push(`*Entrega:* ${formatBRL(fee)}`);
  out.push(`*TOTAL:* ${formatBRL(total)}`, "", "*DADOS DO CLIENTE:*", `Nome: ${p.customer.name}`, `Telefone: ${p.customer.phone}`);
  out.push("", "*TIPO DE PEDIDO:*", FULFILLMENT_LABEL[p.fulfillment]);
  if (p.fulfillment === "entrega" && p.address) {
    out.push("", "*ENDEREÇO:*", `${p.address.street}, ${p.address.number}`);
    if (p.address.complement) out.push(`Complemento: ${p.address.complement}`);
    if (p.address.reference) out.push(`Referência: ${p.address.reference}`);
  }
  out.push("", "*FORMA DE PAGAMENTO:*", PAYMENT_LABEL[p.payment]);
  if (p.payment === "dinheiro" && p.changeForCents !== undefined) out.push(`Troco para: ${formatBRL(p.changeForCents)}`);
  if (p.notes) out.push("", "*OBSERVAÇÕES:*", p.notes);
  out.push("", "Cliente declarou ter 18 anos ou mais (declaração, sem verificação oficial).");
  out.push("_Aguardo a confirmação da Adega do Japa. Valores calculados pelo site; a equipe confere o pedido antes de confirmar._");
  return out.join("\n");
}

export function processOrder(raw: unknown): Result<PricedOrder> {
  const parsed = parseOrder(raw);
  return parsed.ok ? priceOrder(parsed.value) : parsed;
}
