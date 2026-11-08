// ============================================================
//  CATÁLOGO OFICIAL — única fonte de produtos e preços.
//  price em CENTAVOS (1000 = R$ 10,00). O navegador só EXIBE estes valores;
//  o servidor (lib/order.ts + app/api/order) recalcula tudo a partir deste arquivo.
//  Para trocar um preço: edite aqui e publique o site de novo. Não existe endpoint que altere preços.
//  Foto do produto: salve em public/images/produtos/<id>.jpg e preencha "image" (ver README-CARDAPIO.md).
// ============================================================
export type MenuCategoryId = "cervejas" | "drinks" | "refrigerantes" | "aguas";
export type MenuItem = {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly image?: string;
  readonly available?: boolean; // false = não pode ser pedido
  readonly flavorNote?: boolean; // true = pedir para informar o sabor nas observações
};
export type MenuCategory = { readonly id: MenuCategoryId; readonly title: string; readonly items: readonly MenuItem[] };

export function formatBRL(cents: number): string {
  const abs = Math.abs(Math.round(cents));
  const reais = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cents < 0 ? "-" : ""}R$ ${reais},${String(abs % 100).padStart(2, "0")}`;
}

const CATALOG: readonly MenuCategory[] = [
  { id: "cervejas", title: "Cervejas", items: [
    { id: "heineken-long-neck", name: "Heineken Long Neck 330 ml", price: 1000 },
    { id: "heineken-lata", name: "Heineken Lata 350 ml", price: 800 },
    { id: "sol-long-neck", name: "Sol Long Neck 330 ml", price: 800 },
    { id: "brahma-lata", name: "Brahma Lata 350 ml", price: 550 },
    { id: "skol-lata", name: "Skol Lata 350 ml", price: 550 },
    { id: "antarctica-lata", name: "Antarctica Lata 350 ml", price: 600 },
    { id: "original-lata", name: "Original Lata 350 ml", price: 600 },
  ] },
  { id: "drinks", title: "Drinks e bebidas", items: [
    { id: "smirnoff-ice", name: "Smirnoff Ice", price: 1200 },
    { id: "monster-lata", name: "Monster Sabores Lata", price: 1200, flavorNote: true },
  ] },
  { id: "refrigerantes", title: "Refrigerantes", items: [
    { id: "fanta-laranja-lata", name: "Fanta Laranja Lata", price: 550 },
    { id: "guarana-lata", name: "Guaraná Lata", price: 550 },
    { id: "coca-2l", name: "Coca-Cola 2 Litros", price: 1500 },
    { id: "coca-1l", name: "Coca-Cola 1 Litro", price: 1100 },
    { id: "fanta-2l", name: "Fanta 2 Litros", price: 1500 },
    { id: "coca-lata-normal", name: "Coca-Cola Lata Normal", price: 550, image: "/images/produtos/coca-lata-normal.jpg" },
    { id: "coca-lata-zero", name: "Coca-Cola Lata Zero", price: 650 },
  ] },
  { id: "aguas", title: "Águas", items: [
    { id: "agua-com-gas", name: "Água com Gás", price: 450 },
    { id: "agua-sem-gas", name: "Água sem Gás", price: 400 },
  ] },
];

// Congela o catálogo para que nenhum código (nem em runtime) altere preços por acidente.
export const MENU: readonly MenuCategory[] = Object.freeze(
  CATALOG.map(c => Object.freeze({ ...c, items: Object.freeze(c.items.map(i => Object.freeze({ ...i }))) })),
);

export type CatalogItem = MenuItem & { readonly category: MenuCategoryId };
const BY_ID: ReadonlyMap<string, CatalogItem> = new Map(MENU.flatMap(c => c.items.map(i => [i.id, { ...i, category: c.id }] as const)));
export const getItem = (id: string): CatalogItem | undefined => BY_ID.get(id);
