import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Vanthex IA",
  description: "SaaS de IA para Mercado Digital",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
