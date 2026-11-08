import fs from "node:fs/promises";

const file = "lib/menu.ts";
let content = await fs.readFile(file, "utf8");

const images = {
  "heineken-long-neck": "heineken.webp",
  "heineken-lata": "heineken.webp",
  "sol-long-neck": "sol.webp",
  "brahma-lata": "brahma-lata.webp",
  "skol-lata": "skol-lata.webp",
  "antarctica-lata": "antartica-lata.webp",
  "original-lata": "original-lata.webp",
  "smirnoff-ice": "ice.webp",
  "monster-lata": "monster.webp",
  "fanta-laranja-lata": "fanta-lata.webp",
  "guarana-lata": "guarana-lata.webp",
  "coca-2l": "coca-cola-2-litros.webp",
  "coca-1l": "coca-cola-1-litro.webp",
  "fanta-2l": "fanta.webp",
  "coca-lata-zero": "coca-lata-zero.webp",
  "agua-com-gas": "agua-com-gas.webp",
  "agua-sem-gas": "agua-sem-gas.webp",
};

for (const [id, filename] of Object.entries(images)) {
  const pattern = new RegExp(
    `(id: "${id}", name: "[^"]+", price: \\d+)(, flavorNote: true)?`
  );

  if (!pattern.test(content)) {
    throw new Error(`Produto não encontrado: ${id}`);
  }

  content = content.replace(
    pattern,
    (_, product, flavor) =>
      `${product}, image: "/images/produtos/${filename}"${flavor ?? ""}`
  );
}

content = content.replace(
  'image: "/images/produtos/coca-lata-normal.jpg"',
  'image: "/images/produtos/coca-lata-normal.webp"'
);

content = content.replace(
  "salve em public/images/produtos/<id>.jpg",
  "salve em public/images/produtos/<id>.webp"
);

await fs.writeFile(file, content, "utf8");
console.log("Catálogo atualizado: 18 produtos vinculados às imagens.");
