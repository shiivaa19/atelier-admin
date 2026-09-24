import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { LocalProductsProvider } from "@/context/LocalProductsContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AUREUS | Product Management Dashboard",
  description: "Product admin dashboard for catalog and inventory management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`}>
      <body className="bg-luxury-bg text-luxury-text antialiased selection:bg-luxury-gold/30 selection:text-luxury-gold">
        <AuthProvider>
          <LocalProductsProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LocalProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
