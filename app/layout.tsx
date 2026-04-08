import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartClinic — Excellence Médicale en Guinée",
  description: "Plateforme de gestion clinique moderne, sécurisée et résiliente pour la Guinée.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-slate-200 antialiased selection:bg-indigo-500/30`}>
        {children}
      </body>
    </html>
  );
}
