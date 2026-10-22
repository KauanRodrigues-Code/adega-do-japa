// ============================================================
//  EVENTOS DA ADEGA — é AQUI que você cadastra as festas. Não há painel/backend.
//
//  COMO CADASTRAR UMA NOVA FESTA
//  1) Salve o flyer em public/images/eventos/ (ex.: public/images/eventos/halloween.jpg).
//  2) Copie o modelo "EVENTO FUTURO" abaixo para dentro da lista EVENTS e preencha.
//  3) startsAt: data e hora no formato "2026-10-31T22:00:00-03:00" (fuso America/Sao_Paulo = -03:00).
//     Sem data confirmada? Omita startsAt (o card mostra só dateLabel, se houver).
//  4) published: true  -> aparece no site | false -> fica oculto (rascunho).
//  5) status: "agendado" (próxima festa) | "realizado" (vai para Eventos anteriores) | "cancelado" (não aparece).
//  6) tickets: { saleConfirmed: true } -> botão "COMPRAR INGRESSO PELO WHATSAPP".
//              omitido/false          -> botão "CONSULTAR INGRESSOS PELO WHATSAPP".
//     Só escreva preço em tickets.info se for confirmado. Nunca invente valores.
//
//  REGRA AUTOMÁTICA: evento "agendado" com startsAt vira "anterior" sozinho 12 h após o início
//  (ou após endsAt, se informado). Eventos "realizado" nunca mostram botão de ingresso.
// ============================================================
export type EventStatus = "agendado" | "realizado" | "cancelado";
export type EventItem = {
  id: string;
  title: string;
  description?: string;
  flyer?: { src: string; alt: string; width: number; height: number };
  startsAt?: string;   // ISO com fuso, ex.: "2026-10-31T22:00:00-03:00"
  endsAt?: string;
  dateLabel?: string;  // texto livre quando não há data exata (ex.: "Em breve")
  attractions?: string[];
  status: EventStatus;
  published: boolean;
  tickets?: { saleConfirmed?: boolean; info?: string };
};

export const EVENTS: EventItem[] = [
  {
    id: "submundo",
    title: "Submundo",
    flyer: { src: "/images/eventos/submundo.png", width: 272, height: 372, alt: "Flyer da festa Submundo da Adega do Japa, com os DJs Luelin, William e Thiago" },
    attractions: ["DJ Luelin", "DJ William", "DJ Thiago"],
    status: "realizado",   // data/horário/ingresso NÃO informados: o site mostra só "Evento realizado"
    published: true,
  },

  // ---- MODELO: EVENTO FUTURO (copie, descomente e preencha) ----
  // {
  //   id: "nome-da-festa",
  //   title: "Nome da festa",
  //   description: "Texto curto sobre a festa.",
  //   flyer: { src: "/images/eventos/nome-da-festa.jpg", width: 1080, height: 1350, alt: "Flyer da festa Nome da festa" },
  //   startsAt: "2026-11-15T22:00:00-03:00",
  //   attractions: ["DJ Fulano"],
  //   status: "agendado",
  //   published: true,
  //   tickets: { saleConfirmed: false },
  // },
];

// ---------------- lógica (não precisa editar) ----------------
export type EventKind = "upcoming" | "past" | "hidden";
const GRACE_MS = 12 * 60 * 60 * 1000;

export function classify(e: EventItem, now: number | null): EventKind {
  if (!e.published || e.status === "cancelado") return "hidden";
  if (e.status === "realizado") return "past";
  if (now !== null) {
    const start = e.startsAt ? Date.parse(e.startsAt) : NaN;
    const end = e.endsAt ? Date.parse(e.endsAt) : NaN;
    const limit = !Number.isNaN(end) ? end : !Number.isNaN(start) ? start + GRACE_MS : NaN;
    if (!Number.isNaN(limit) && now > limit) return "past";
  }
  return "upcoming";
}

const ts = (e: EventItem) => (e.startsAt ? Date.parse(e.startsAt) : NaN);
export function splitEvents(list: EventItem[], now: number | null) {
  const upcoming = list.filter(e => classify(e, now) === "upcoming")
    .sort((a, b) => (Number.isNaN(ts(a)) ? Infinity : ts(a)) - (Number.isNaN(ts(b)) ? Infinity : ts(b)));
  const past = list.filter(e => classify(e, now) === "past")
    .sort((a, b) => (Number.isNaN(ts(b)) ? -Infinity : ts(b)) - (Number.isNaN(ts(a)) ? -Infinity : ts(a)));
  return { upcoming, past };
}

export function formatWhen(e: EventItem): string | null {
  if (!e.startsAt || Number.isNaN(Date.parse(e.startsAt))) return e.dateLabel ?? null;
  const d = new Date(e.startsAt);
  const day = d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "long", day: "2-digit", month: "long" });
  const time = d.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).replace(":00", "h").replace(":", "h");
  return `${day} · ${time}`;
}

export const ticketMessage = (title: string) =>
  `Olá! Gostaria de saber mais sobre os ingressos para o evento ${title} da Adega do Japa. Poderia me passar os valores e as informações de compra?`;
