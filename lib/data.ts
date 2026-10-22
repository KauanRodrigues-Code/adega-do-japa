// ============================================================
//  EDITE AQUI: dados centralizados do site (contato, mapa, textos)
// ============================================================
export const SITE = {
  name: "Adega do Japa",
  whatsapp: "5543996683297",
  phoneLabel: "(43) 99668-3297",
  instagram: "adega_dojapa1",
  instagramUrl: "https://www.instagram.com/adega_dojapa1/",
  developerUrl: "https://kauanrodrigues.dev.br",
  // --- LOCALIZAÇÃO (endereço confirmado pelo proprietário) ---
  // Para mudar de endereço: atualize "address" e "mapsUrl".
  address: "R. Telêmaco Carneiro, 645 - Arapoti, PR, 84990-000", // endereço CONFIRMADO pelo proprietário
  mapsUrl: "https://www.google.com/maps/place/R.+Tel%C3%AAmaco+Carneiro,+645+-+Arapoti,+PR,+84990-000/@-24.1488412,-49.8245545,17z/data=!3m1!4b1!4m6!3m5!1s0x94c211a4faee147b:0x679d743932ddfb02!8m2!3d-24.1488461!4d-49.8219796!16s%2Fg%2F11rgf892sk",
  mapQuery: "R. Telêmaco Carneiro, 645 - Arapoti, PR, 84990-000", // texto que consta no próprio link de referência
  locationProvisional: false,
  embedUrl: "", // opcional: src do iframe do Google Maps (Compartilhar > Incorporar um mapa). Se vazio, o site gera um embed a partir do endereço.
};

export const wa = (msg: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
export const MSG = {
  promo: "Olá! Vim pelo site da Adega do Japa e queria saber das promoções.",
  combos: "Olá! Gostaria de saber quais combos estão disponíveis.",
  events: "Olá! Gostaria de informações sobre os próximos eventos.",
  burger: "Olá! Vim pelo site da Adega do Japa e quero pedir o Hambúrguer Artesanal.",
  order: "Olá! Vim pelo site da Adega do Japa e gostaria de fazer um pedido.",
  location: "Olá! Poderia me passar a localização da Adega do Japa?",
};

export const NAV = [["Início","#inicio"],["Combos","#combos"],["Cardápio","#cardapio"],["Promoções","#promocoes"],["Eventos","#eventos"],["Sobre","#sobre"],["Contato","#contato"]] as const;

// ----- Localização (derivada do endereço; não precisa de chave de API) -----
const mapTarget = SITE.address || SITE.mapQuery;
export const MAP = {
  hasLocation: Boolean(mapTarget || SITE.mapsUrl),
  embedUrl: SITE.embedUrl || (mapTarget ? `https://www.google.com/maps?q=${encodeURIComponent(mapTarget)}&output=embed` : ""),
  openUrl: SITE.mapsUrl || (mapTarget ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapTarget)}` : ""),
  routeUrl: mapTarget ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapTarget)}` : SITE.mapsUrl,
};

// ----- Fotos reais (arquivos em public/images/fotos) -----
export type Photo = { src: string; alt: string; w: number; h: number; position?: string };
export const PHOTOS = {
  verdeVermelho: { src: "/images/fotos/verde-vermelho.jpg", w: 900, h: 1200, alt: "Dois copões gelados da Adega do Japa, um verde e outro vermelho, com pedra de gelo colorida" },
  azulVerde: { src: "/images/fotos/azul-verde.jpg", w: 900, h: 1200, alt: "Copões gelados azul e verde com o selo da Adega do Japa" },
  mangaJack: { src: "/images/fotos/manga-jack.jpg", w: 900, h: 1200, alt: "Copão cremoso amarelo com chantilly e pedaços de manga" },
  picoleParede: { src: "/images/fotos/picole-parede.jpg", w: 900, h: 1200, alt: "Copões cremosos rosa e amarelo com picolé, ao lado do selo Adega do Japa na parede" },
  suporteBar: { src: "/images/fotos/suporte-bar.jpg", w: 900, h: 1200, alt: "Dois copos cremosos de chocolate e rosa em suporte de papelão, no balcão da adega" },
  tresCopos: { src: "/images/fotos/tres-copos.jpg", w: 900, h: 1003, alt: "Três copões cremosos com calda e picolé: vermelho, branco e roxo" },
  picoleEmbalado: { src: "/images/fotos/picole-embalado.jpg", w: 900, h: 1200, alt: "Dois copos cremosos com picolés embalados por cima, em suporte da Adega do Japa" },
  chocolateWhisky: { src: "/images/fotos/chocolate-whisky.jpg", w: 900, h: 1200, alt: "Dois copões com calda de chocolate e picolé, em frente às garrafas do balcão" },
  brancoGin: { src: "/images/fotos/branco-gin.jpg", w: 882, h: 1200, alt: "Copão cremoso com chantilly e picolé branco, com garrafas ao fundo" },
} satisfies Record<string, Photo>;

// ----- Combos / produtos (nomes descritivos do que aparece na foto; preço só quando confirmado) -----
export type Product = { id: string; name: string; description?: string; price?: string; photo: Photo; promo?: boolean };
export const PRODUCTS: Product[] = [
  { id: "p1", name: "Copão com picolé", photo: PHOTOS.picoleParede },
  { id: "p2", name: "Copão cremoso de chocolate", photo: PHOTOS.chocolateWhisky },
  { id: "p3", name: "Trio de copões", photo: PHOTOS.tresCopos },
  { id: "p4", name: "Copão gelado com picolé", photo: PHOTOS.picoleEmbalado },
  { id: "p5", name: "Dupla para levar", photo: PHOTOS.suporteBar },
  { id: "p6", name: "Copão de picolé branco", photo: PHOTOS.brancoGin },
];

// ----- Promoção (deixe price vazio para exibir só o convite ao WhatsApp) -----
export const PROMO = { name: "", description: "", oldPrice: "", price: "", discount: "", validity: "" };

// ----- Hambúrguer -----
export const BURGER = { price: "R$ 10,00", image: "/images/burger/burger.jpg", imageAlt: "Hambúrguer artesanal da Adega do Japa com pão brioche, cheddar e alface." };

// ----- Eventos (vazio = a seção mostra o ambiente). Preencha só com eventos confirmados. -----
export type Event = { name: string; date: string; time?: string; attractions?: string[]; description?: string };
export const EVENTS: Event[] = [];
export const EVENT_GALLERY: Photo[] = [PHOTOS.chocolateWhisky, PHOTOS.azulVerde, PHOTOS.suporteBar, PHOTOS.verdeVermelho];

// ----- Sobre -----
export const ABOUT_PHOTO = PHOTOS.picoleParede;
