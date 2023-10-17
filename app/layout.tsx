import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home: Forest and For-rest",
  description: "VIVLE-THEME-MUSEUM : Home-Forest-And-Forest by Serim Yang",
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
