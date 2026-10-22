// ============================================================
//  CARDÁPIO DIGITAL — edite preços/itens aqui. price em CENTAVOS (1000 = R$ 10,00).
// ============================================================
export type MenuCategoryId = "cervejas" | "drinks" | "refrigerantes" | "energeticos" | "aguas";
export type MenuItem = { id: string; name: string; price: number };
export type MenuCategory = { id: MenuCategoryId; title: string; items: MenuItem[] };

export const formatBRL = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const MENU: MenuCategory[] = [
  { id: "cervejas", title: "Cervejas", items: [
    { id: "heineken-long-neck", name: "Heineken Long Neck 330 ml", price: 1000 },
    { id: "heineken-lata", name: "Heineken lata 350 ml", price: 800 },
    { id: "sol-long-neck", name: "Sol Long Neck 330 ml", price: 800 },
    { id: "brahma-lata", name: "Brahma lata 350 ml", price: 550 },
    { id: "skol-lata", name: "Skol lata 350 ml", price: 550 },
    { id: "antartica", name: "Antártica 350 ml", price: 600 },
    { id: "original", name: "Original 350 ml", price: 600 },
  ] },
  { id: "drinks", title: "Drinks e Ice", items: [
    { id: "ice-smirnoff", name: "Ice Smirnoff", price: 1200 },
  ] },
  { id: "refrigerantes", title: "Refrigerantes", items: [
    { id: "fanta-lata-laranja", name: "Fanta lata laranja", price: 550 },
    { id: "guarana-lata", name: "Guaraná lata", price: 550 },
    { id: "coca-2l", name: "Coca-Cola 2 litros", price: 1500 },
    { id: "coca-1l", name: "Coca-Cola 1 litro", price: 1100 },
    { id: "fanta-2l", name: "Fanta 2 litros", price: 1500 },
    { id: "coca-lata-normal", name: "Coca-Cola lata normal", price: 550 },
    { id: "coca-lata-zero", name: "Coca-Cola lata zero", price: 650 },
    // ATENÇÃO: "Coca-Cola litros normal" (R$ 11,00) pode ser o mesmo produto de "Coca-Cola 1 litro". Mantido como informado; confirmar com o dono.
    { id: "coca-litros-normal", name: "Coca-Cola litros normal", price: 1100 },
  ] },
  { id: "energeticos", title: "Energéticos", items: [
    { id: "monster-lata", name: "Monster sabores lata", price: 1200 },
  ] },
  { id: "aguas", title: "Águas", items: [
    { id: "agua-com-gas", name: "Água com gás", price: 450 },
    { id: "agua-sem-gas", name: "Água sem gás", price: 400 },
  ] },
];
