// ============================================================
//  CATÁLOGO OFICIAL — única fonte de produtos e preços.
//  price em CENTAVOS (1000 = R$ 10,00). O navegador só EXIBE estes valores;
//  o servidor (lib/order.ts + app/api/order) recalcula tudo a partir deste arquivo.
//  Para trocar um preço: edite aqui e publique o site de novo. Não existe endpoint que altere preços.
//  Foto do produto: salve em public/images/produtos/<id>.webp e preencha "image" (ver README-CARDAPIO.md).
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
    { id: "heineken-long-neck", name: "Heineken Long Neck 330 ml", price: 1000, image: "/images/produtos/heineken.webp" },
    { id: "heineken-lata", name: "Heineken Lata 350 ml", price: 800, image: "/images/produtos/heineken.webp" },
    { id: "sol-long-neck", name: "Sol Long Neck 330 ml", price: 800, image: "/images/produtos/sol.webp" },
    { id: "brahma-lata", name: "Brahma Lata 350 ml", price: 550, image: "/images/produtos/brahma-lata.webp" },
    { id: "skol-lata", name: "Skol Lata 350 ml", price: 550, image: "/images/produtos/skol-lata.webp" },
    { id: "antarctica-lata", name: "Antarctica Lata 350 ml", price: 600, image: "/images/produtos/antartica-lata.webp" },
    { id: "original-lata", name: "Original Lata 350 ml", price: 600, image: "/images/produtos/original-lata.webp" },
  ] },
  { id: "drinks", title: "Drinks e bebidas", items: [
    { id: "smirnoff-ice", name: "Smirnoff Ice", price: 1200, image: "/images/produtos/ice.webp" },
    { id: "monster-lata", name: "Monster Sabores Lata", price: 1200, image: "/images/produtos/monster.webp", flavorNote: true },
  ] },
  { id: "refrigerantes", title: "Refrigerantes", items: [
    { id: "fanta-laranja-lata", name: "Fanta Laranja Lata", price: 550, image: "/images/produtos/fanta-lata.webp" },
    { id: "guarana-lata", name: "Guaraná Lata", price: 550, image: "/images/produtos/guarana-lata.webp" },
    { id: "coca-2l", name: "Coca-Cola 2 Litros", price: 1500, image: "/images/produtos/coca-cola-2-litros.webp" },
    { id: "coca-1l", name: "Coca-Cola 1 Litro", price: 1100, image: "/images/produtos/coca-cola-1-litro.webp" },
    { id: "fanta-2l", name: "Fanta 2 Litros", price: 1500, image: "/images/produtos/fanta.webp" },
    { id: "coca-lata-normal", name: "Coca-Cola Lata Normal", price: 550, image: "/images/produtos/coca-lata-normal.webp" },
    { id: "coca-lata-zero", name: "Coca-Cola Lata Zero", price: 650, image: "/images/produtos/coca-lata-zero.webp" },
  ] },
  { id: "aguas", title: "Águas", items: [
    { id: "agua-com-gas", name: "Água com Gás", price: 450, image: "/images/produtos/agua-com-gas.webp" },
    { id: "agua-sem-gas", name: "Água sem Gás", price: 400, image: "/images/produtos/agua-sem-gas.webp" },
  ] },
];

// Congela o catálogo para que nenhum código (nem em runtime) altere preços por acidente.
export const MENU: readonly MenuCategory[] = Object.freeze(
  CATALOG.map(c => Object.freeze({ ...c, items: Object.freeze(c.items.map(i => Object.freeze({ ...i }))) })),
);

export type CatalogItem = MenuItem & { readonly category: MenuCategoryId };
const BY_ID: ReadonlyMap<string, CatalogItem> = new Map(MENU.flatMap(c => c.items.map(i => [i.id, { ...i, category: c.id }] as const)));
export const getItem = (id: string): CatalogItem | undefined => BY_ID.get(id);
