import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DuranAI | Seu assistente inteligente",
  description: "Converse, crie e descubra com o DuranAI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
