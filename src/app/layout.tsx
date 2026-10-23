import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarefas",
  description: "Gerenciador de tarefas simples com Next.js e tRPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
