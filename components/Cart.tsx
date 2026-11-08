"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, MessageCircle, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { DELIVERY_FEE_CENTS, FULFILLMENT_LABEL, PAYMENT_LABEL } from "@/lib/orderConfig";
import { formatBRL } from "@/lib/menu";
import type { PricedOrder } from "@/lib/order";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import OrderSummary from "./OrderSummary";

type Step = "cart" | "checkout" | "done";

export function CartFab() {
  const { count, open, isOpen } = useCart();
  if (isOpen) return null;
  return (
    <button type="button" onClick={open} aria-label={`Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`} className="fixed bottom-4 right-4 z-40 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-japa-orange to-japa-gold text-black shadow-xl glow transition hover:scale-105">
      <ShoppingCart size={26} aria-hidden />
      {count > 0 && <span className="absolute -right-1 -top-1 grid min-h-6 min-w-6 place-items-center rounded-full bg-japa-red px-1 text-xs font-bold text-white">{count}</span>}
    </button>
  );
}

export function CartDrawer() {
  const { isOpen, close, lines, subtotalCents, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [order, setOrder] = useState<PricedOrder | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [isOpen, close]);

  if (!isOpen) return null;
  const title = step === "cart" ? "Seu pedido" : step === "checkout" ? "Finalizar pedido" : "Pedido pronto";
  const finish = () => { clear(); setOrder(null); setStep("cart"); close(); };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Fechar carrinho" tabIndex={-1} onClick={close} className="absolute inset-0 cursor-default bg-black/80" />
      <div className="relative flex h-[100dvh] w-full max-w-md flex-col border-l border-white/10 bg-japa-card">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="font-display text-2xl uppercase">{title}</h2>
          <button ref={closeRef} type="button" onClick={close} aria-label="Fechar carrinho" className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/10"><X aria-hidden /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === "cart" && (lines.length === 0 ? (
            <div className="grid place-items-center py-16 text-center">
              <div>
                <ShoppingCart className="mx-auto text-japa-orange" size={40} aria-hidden />
                <p className="mt-3 font-semibold">Seu carrinho está vazio</p>
                <p className="mt-1 text-sm text-white/60">Escolha suas bebidas no cardápio.</p>
                <button type="button" onClick={close} className="mt-5 inline-flex min-h-12 items-center rounded-full border border-japa-orange px-6 text-sm font-extrabold text-japa-orange hover:bg-japa-orange hover:text-black">VER CARDÁPIO</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-3" aria-label="Itens do carrinho">{lines.map(l => <CartItem key={l.id} line={l} />)}</ul>
              <OrderSummary subtotalCents={subtotalCents} deliveryFeeCents={null} deliveryNote={`${formatBRL(DELIVERY_FEE_CENTS)} se for entrega`} totalCents={null} estimate />
              <button type="button" onClick={() => setStep("checkout")} className="flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-base font-extrabold text-black transition hover:scale-[1.02]">CONTINUAR</button>
              <button type="button" onClick={clear} className="min-h-11 w-full text-sm text-white/60 hover:text-japa-red">Limpar carrinho</button>
            </div>
          ))}
          {step === "checkout" && <Checkout onBack={() => setStep("cart")} onDone={o => { setOrder(o); setStep("done"); }} />}
          {step === "done" && order && (
            <div className="space-y-4">
              <p className="flex items-center gap-2 font-semibold text-japa-gold"><CheckCircle2 aria-hidden />Pedido conferido pelo servidor</p>
              <p className="text-sm text-white/70">{FULFILLMENT_LABEL[order.fulfillment]} · Pagamento: {PAYMENT_LABEL[order.payment]}{order.changeForCents !== undefined ? ` (troco para ${formatBRL(order.changeForCents)})` : ""}</p>
              <OrderSummary lines={order.lines} subtotalCents={order.subtotalCents} deliveryFeeCents={order.fulfillment === "entrega" ? order.deliveryFeeCents : 0} totalCents={order.totalCents} />
              <a href={order.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-base font-extrabold text-black transition hover:scale-[1.02]"><MessageCircle size={20} aria-hidden />ABRIR WHATSAPP E ENVIAR</a>
              <p className="rounded-2xl border border-japa-gold/40 bg-japa-gold/10 p-3 text-sm text-japa-gold">O pedido só é enviado quando você toca em enviar no WhatsApp. Ele ainda precisa ser <strong>confirmado pela equipe da Adega do Japa</strong>, que confere os valores antes de aceitar. O WhatsApp não confirma pagamento.</p>
              <button type="button" onClick={finish} className="min-h-12 w-full rounded-full border border-white/20 text-sm font-bold hover:border-japa-orange">Já enviei: limpar carrinho e fechar</button>
              <button type="button" onClick={() => setStep("cart")} className="min-h-11 w-full text-sm text-white/60 hover:text-japa-gold">Voltar e editar o pedido</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
