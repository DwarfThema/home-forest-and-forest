import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home: Forest and For-rest",
  description: "THEME-MUSEUM : Home-Forest-And-Forest by Serim Yang",
  openGraph: {
    title: "Home: Forest and For-rest",
    description: "THEME-MUSEUM : Home-Forest-And-Forest by Serim Yang",
    url: "https://www.memory-service-centre.com ",
    images: [
      {
        url: "/thumbnail.jpeg",
        width: 800,
        height: 600,
      },
      {
        url: "/thumbnail.jpeg",
        width: 1800,
        height: 1600,
        alt: "Home: Forest and For-rest",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home: Forest and For-rest",
    description: "THEME-MUSEUM : Home-Forest-And-Forest by Serim Yang",
    creator: "JunhoPark & Serim Yang",
    images: ["/thumbnail.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"font-main"}>{children}</body>
    </html>
  );
}
