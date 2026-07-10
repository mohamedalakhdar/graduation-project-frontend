import type { Metadata } from "next";
import { Nunito, Geist, Cairo } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "@/app/student/style.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IntlProvider } from "@/i18n/IntlProvider";
import { getLocale, getMessages } from "@/i18n/server";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "SIS Admin",
  description: "Student Information System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        nunito.variable,
        geist.variable,
        cairo.variable,
        locale === "ar" ? "font-cairo" : "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <IntlProvider locale={locale} messages={messages}>
          <TooltipProvider>{children}</TooltipProvider>
        </IntlProvider>
        <Toaster />
      </body>
    </html>
  );
}
