import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "どうなりたい？ | 効果で選ぶ美容プラットフォーム",
  description: "なりたい状態はありますか？対処したい悩みはありますか？「どうなりたい？」は、肌の赤み・青ひげ・毛穴などを目的から探せる、効果ドリブンの美容プラットフォームです。",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} font-sans antialiased`}
      >
        <Header />
        {children}
        {measurementId && <GoogleAnalytics measurementId={measurementId} />}
      </body>
    </html>
  );
}
