"use client";
import { useState } from "react";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { getItem } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { DELIVERY_FEE_CENTS, FULFILLMENT_LABEL, PAYMENTS, PAYMENT_LABEL, type Fulfillment, type Payment } from "@/lib/orderConfig";
import type { PricedOrder } from "@/lib/order";
import OrderSummary from "./OrderSummary";

const input = "mt-1 block min-h-12 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-base text-white placeholder:text-white/30 focus:border-japa-orange";
const label = "block text-sm font-semibold text-white/85";

function isApiOk(d: unknown): d is { ok: true; order: PricedOrder } {
  return typeof d === "object" && d !== null && (d as { ok?: unknown }).ok === true && typeof (d as { order?: unknown }).order === "object";
}
function isApiErr(d: unknown): d is { ok: false; errors: string[] } {
  return typeof d === "object" && d !== null && Array.isArray((d as { errors?: unknown }).errors);
}

export default function Checkout({ onBack, onDone }: { onBack: () => void; onDone: (o: PricedOrder) => void }) {
  const { lines, subtotalCents } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("entrega");
  const [payment, setPayment] = useState<Payment>("pix");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [changeFor, setChangeFor] = useState("");
  const [notes, setNotes] = useState("");
  const [age, setAge] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fee = fulfillment === "entrega" ? DELIVERY_FEE_CENTS : 0;
  const summaryLines = lines.flatMap(l => {
    const it = getItem(l.id);
    return it ? [{ name: it.name, qty: l.qty, unitCents: it.price, lineCents: it.price * l.qty }] : [];
  });
  const hasFlavor = lines.some(l => getItem(l.id)?.flavorNote);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErrors([]);
    // O navegador envia SOMENTE ids, quantidades e dados do cliente. Nenhum preço, taxa ou total.
    const payload = {
      items: lines.map(l => ({ id: l.id, qty: l.qty })),
      fulfillment, payment, ageConfirmed: age,
      customer: { name, phone },
      ...(fulfillment === "entrega" ? { address: { street, number, complement, reference } } : {}),
      ...(payment === "dinheiro" && changeFor.trim() ? { changeFor } : {}),
      notes,
    };
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      let data: unknown = null;
      try { data = await res.json(); } catch { /* resposta sem JSON */ }
      if (res.ok && isApiOk(data)) onDone(data.order);
      else if (res.status === 429) setErrors(["Muitas tentativas. Aguarde um minuto e tente novamente."]);
      else if (isApiErr(data)) setErrors(data.errors);
      else setErrors(["Não foi possível enviar o pedido agora. Tente novamente."]);
    } catch {
      setErrors(["Sem conexão. Verifique a internet e tente novamente."]);
    } finally {
      setBusy(false);
    }
  }

  const choice = (active: boolean) => `flex min-h-12 cursor-pointer items-center justify-center rounded-full border px-4 text-sm font-bold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-japa-gold ${active ? "border-japa-orange bg-japa-orange text-black" : "border-white/20 text-white/80 hover:border-japa-orange"}`;

  return (
    <form onSubmit={submit} className="space-y-6" noValidate={false}>
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/70 hover:text-japa-gold"><ArrowLeft size={16} aria-hidden />Voltar ao carrinho</button>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-japa-gold">Como você quer receber?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["entrega", "retirada"] as const).map(f => (
            <label key={f} className={choice(fulfillment === f)}>
              <input type="radio" name="fulfillment" value={f} checked={fulfillment === f} onChange={() => setFulfillment(f)} className="sr-only" />
              {f === "entrega" ? "Entrega" : "Retirada"}
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-white/60">{fulfillment === "entrega" ? "Taxa de entrega fixa de R$ 10,00." : "Sem taxa. O pedido será retirado na Adega do Japa."}</p>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-japa-gold">Seus dados</legend>
        <label className={label}>Nome<input className={input} value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={60} autoComplete="name" placeholder="Seu nome" /></label>
        <label className={label}>Telefone (com DDD)<input className={input} value={phone} onChange={e => setPhone(e.target.value)} required maxLength={20} inputMode="tel" autoComplete="tel" placeholder="(43) 99999-9999" /></label>
      </fieldset>

      {fulfillment === "entrega" && (
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-japa-gold">Endereço de entrega</legend>
          <label className={label}>Endereço<input className={input} value={street} onChange={e => setStreet(e.target.value)} required minLength={3} maxLength={80} autoComplete="street-address" placeholder="Rua, avenida..." /></label>
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <label className={label}>Número<input className={input} value={number} onChange={e => setNumber(e.target.value)} required maxLength={10} inputMode="numeric" /></label>
            <label className={label}>Complemento<input className={input} value={complement} onChange={e => setComplement(e.target.value)} maxLength={40} placeholder="Casa, apto..." /></label>
          </div>
          <label className={label}>Ponto de referência<input className={input} value={reference} onChange={e => setReference(e.target.value)} maxLength={80} placeholder="Próximo a..." /></label>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase tracking-wider text-japa-gold">Forma de pagamento</legend>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENTS.map(p => (
            <label key={p} className={choice(payment === p)}>
              <input type="radio" name="payment" value={p} checked={payment === p} onChange={() => setPayment(p)} className="sr-only" />
              {PAYMENT_LABEL[p]}
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-white/60">O pagamento é combinado com a adega pelo WhatsApp. Não há pagamento online no site.</p>
        {payment === "dinheiro" && (
          <label className={`${label} mt-3`}>Troco para quanto? (opcional)<input className={input} value={changeFor} onChange={e => setChangeFor(e.target.value)} inputMode="decimal" maxLength={10} placeholder="Ex.: 50,00" /></label>
        )}
      </fieldset>

      <label className={label}>Observações (opcional){hasFlavor && <span className="block text-xs font-normal text-japa-gold">Para a Monster, informe o sabor desejado aqui.</span>}
        <textarea className={`${input} min-h-24 py-2`} value={notes} onChange={e => setNotes(e.target.value)} maxLength={200} rows={3} />
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm">
        <input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)} required className="mt-1 h-5 w-5 shrink-0 accent-orange-500" />
        <span>Confirmo que tenho 18 anos ou mais. <span className="text-white/50">É uma declaração sua; o site não faz verificação oficial de idade.</span></span>
      </label>

      <OrderSummary lines={summaryLines} subtotalCents={subtotalCents} deliveryFeeCents={fee} totalCents={subtotalCents + fee} estimate />

      {errors.length > 0 && (
        <div role="alert" className="rounded-2xl border border-japa-red/60 bg-japa-red/10 p-3 text-sm">
          <ul className="list-disc space-y-1 pl-5">{errors.map(m => <li key={m}>{m}</li>)}</ul>
        </div>
      )}

      <button type="submit" disabled={busy || !age || lines.length === 0} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-base font-extrabold text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
        {busy ? <><Loader2 className="animate-spin" size={20} aria-hidden />CONFERINDO PEDIDO...</> : <><MessageCircle size={20} aria-hidden />ENVIAR PEDIDO PELO WHATSAPP</>}
      </button>
      <p className="text-center text-xs text-white/50">{FULFILLMENT_LABEL[fulfillment]} · a equipe da adega confere e confirma o pedido pelo WhatsApp.</p>
    </form>
  );
}
