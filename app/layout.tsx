import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Nearlooc", template: "%s | Nearlooc" },
  description: "Discover the best deals and offers near you",
  keywords: ["deals", "offers", "discounts", "local", "marketplace"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-surface text-on-surface`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
