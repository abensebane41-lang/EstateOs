import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter, Cinzel } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EstateOS | منصة إدارة العقارات",
  description: "منصة احترافية لإدارة العقارات والوكلاء العقاريين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <head>
      <meta name="color-scheme" content="light" />
    </head>
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} ${inter.variable} ${cinzel.variable}`} style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className="min-h-screen bg-surface font-sans antialiased" style={{ backgroundColor: "#FAFAF8" }}>
        {children}
      </body>
    </html>
  );
}
