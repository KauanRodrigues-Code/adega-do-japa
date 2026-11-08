import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/images/produtos");
const files = (await fs.readdir(dir)).filter((file) =>
  /\.(jpg|jpeg|png)$/i.test(file)
);

let originalTotal = 0;
let optimizedTotal = 0;

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, `${path.parse(file).name}.webp`);

  const originalSize = (await fs.stat(input)).size;

  await sharp(input)
    .rotate()
    .resize({
      width: 900,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  const optimizedSize = (await fs.stat(output)).size;

  originalTotal += originalSize;
  optimizedTotal += optimizedSize;

  const reduction = (1 - optimizedSize / originalSize) * 100;

  console.log(
    `${file}: ${(originalSize / 1024).toFixed(0)} KB -> ${(optimizedSize / 1024).toFixed(0)} KB (${reduction.toFixed(1)}% menor)`
  );
}

console.log("\n===== RESULTADO =====");
console.log(`Imagens convertidas: ${files.length}`);
console.log(`Antes: ${(originalTotal / 1024 / 1024).toFixed(2)} MB`);
console.log(`Depois: ${(optimizedTotal / 1024 / 1024).toFixed(2)} MB`);
console.log(`Redução total: ${((1 - optimizedTotal / originalTotal) * 100).toFixed(1)}%`);
