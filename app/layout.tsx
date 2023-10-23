import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import thumbnail from "../public/thumbnail.jpeg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://home-forest-and-forest.vercel.app/"),
  title: "Home: Forest and For-rest",
  description: "THEME-MUSEUM : Home-Forest-And-Forest by Serim Yang",
  openGraph: {
    title: "Home: Forest and For-rest",
    description: "THEME-MUSEUM : Home-Forest-And-Forest by Serim Yang",
    url: "https://www.homeforestandfor-rest.com",
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
        alt: "My custom alt",
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
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
