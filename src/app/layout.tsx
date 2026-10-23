import { ListChecks } from "lucide-react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Toaster } from "@/components/toaster";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");
  return {
    title: { default: t("nome"), template: `%s | ${t("nome")}` },
    description: t("descricao"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("app");

  return (
    <html lang={locale}>
      <body className={geistSans.variable}>
        <NextIntlClientProvider>
          <TRPCReactProvider>
            <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_60%)]">
              <nav className="bg-card/70 border-b backdrop-blur">
                <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <span className="bg-primary text-primary-foreground rounded-md p-1">
                      <ListChecks className="size-4" />
                    </span>
                    {t("nome")}
                  </Link>
                </div>
              </nav>
              <main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
            </div>
            <Toaster />
          </TRPCReactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
