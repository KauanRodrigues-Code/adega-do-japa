import { formatBRL } from "@/lib/menu";

export type SummaryLine = { name: string; qty: number; unitCents: number; lineCents: number };

export default function OrderSummary({ lines, subtotalCents, deliveryFeeCents, deliveryNote, totalCents, estimate = false }: {
  lines?: SummaryLine[];
  subtotalCents: number;
  deliveryFeeCents: number | null; // null = ainda não escolhido
  deliveryNote?: string;
  totalCents: number | null;
  estimate?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-japa-orange/30 bg-black/40 p-4 text-sm">
      {lines && lines.length > 0 && (
        <ul className="mb-3 space-y-1 border-b border-white/10 pb-3">
          {lines.map(l => <li key={l.name} className="flex justify-between gap-3"><span>{l.qty}x {l.name}</span><span className="shrink-0 tabular-nums">{formatBRL(l.lineCents)}</span></li>)}
        </ul>
      )}
      <dl className="space-y-1">
        <div className="flex justify-between"><dt className="text-white/70">Subtotal</dt><dd className="tabular-nums">{formatBRL(subtotalCents)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-white/70">Entrega</dt><dd className="text-right tabular-nums">{deliveryFeeCents === null ? (deliveryNote ?? "—") : deliveryFeeCents === 0 ? "Sem taxa" : formatBRL(deliveryFeeCents)}</dd></div>
        <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold"><dt>Total</dt><dd className="font-display text-2xl text-japa-gold tabular-nums">{totalCents === null ? "—" : formatBRL(totalCents)}</dd></div>
      </dl>
      {estimate && <p className="mt-2 text-xs text-white/50">Valores de conferência: o total final é calculado e confirmado pelo servidor ao enviar o pedido.</p>}
    </div>
  );
}
