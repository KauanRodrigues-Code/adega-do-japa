import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
export const metadata: Metadata = {
  title: "Adega do Japa | Seu rolê começa aqui",
  description: "Adega do Japa — bebidas geladas, combos, promoções, festas e muita resenha. Chame no WhatsApp.",
  openGraph: { title: "Adega do Japa | Seu rolê começa aqui", description: "Bebidas geladas, combos, promoções, festas e muita resenha.", type: "website", locale: "pt_BR" },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#0a0a0a", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
