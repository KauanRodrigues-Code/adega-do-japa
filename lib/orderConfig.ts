// Constantes do pedido, compartilhadas entre o navegador (só para exibir) e o servidor (fonte oficial).
export const DELIVERY_FEE_CENTS = 1000; // taxa fixa de entrega: R$ 10,00 (o servidor SEMPRE recalcula)
export const MAX_QTY_PER_ITEM = 24;
export const MAX_LINES = 30;
export const MAX_UNITS = 100;
export const MAX_BODY_BYTES = 8 * 1024;

export const FULFILLMENTS = ["entrega", "retirada"] as const;
export const PAYMENTS = ["pix", "dinheiro", "credito", "debito"] as const;
export type Fulfillment = (typeof FULFILLMENTS)[number];
export type Payment = (typeof PAYMENTS)[number];

export const FULFILLMENT_LABEL: Record<Fulfillment, string> = { entrega: "Entrega", retirada: "Retirada na Adega do Japa" };
export const PAYMENT_LABEL: Record<Payment, string> = { pix: "Pix", dinheiro: "Dinheiro", credito: "Cartão de crédito", debito: "Cartão de débito" };
