import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediFast | 24h-Apotheke für Sie erreichbar",
  description:
    "A web app that connects sick people with available couriers/pharmacies to get prescription or OTC medicines delivered fast — like Uber Eats but only for medicines.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "MediFast" },
};

const rtlLocales = ["ar", "fa"];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-next-locale") || "de";
  const isRtl = rtlLocales.includes(locale);

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
