import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google"; // Utilisation de polices Google modernes
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SmartClinic — Gestion Clinique & Portail Patient",
  description:
    "Plateforme de gestion clinique haut de gamme et portail patient SmartClinic — Guinée",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-inter">
        {children}
      </body>
    </html>
  );
}
