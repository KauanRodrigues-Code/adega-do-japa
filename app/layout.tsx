import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adegadojapa.net.br"),

  title: {
    default: "Adega do Japa | Seu rolê começa aqui",
    template: "%s | Adega do Japa",
  },

  description:
    "Adega do Japa — bebidas geladas, combos, promoções, festas e muita resenha. Confira as novidades e entre em contato pelo WhatsApp.",

  applicationName: "Adega do Japa",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Adega do Japa | Seu rolê começa aqui",
    description:
      "Bebidas geladas, combos, promoções, festas e muita resenha.",
    type: "website",
    locale: "pt_BR",
    url: "https://adegadojapa.net.br",
    siteName: "Adega do Japa",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        {children}
        <GoogleAnalytics gaId="G-5VT3K4MJ4R" />
      </body>
    </html>
  );
}