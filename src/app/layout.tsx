import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist'
});

export const metadata: Metadata = {
  title: "Lucid Apes NFT Collection",
  description: "Join our exclusive NFT collection in the metaverse",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-[#030303] min-h-screen antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}