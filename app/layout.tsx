import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const fonts = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Get Git",
  description: "Explore GitHub profiles in more Stylish ways",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fonts.className} bg-gradient-to-b from-neutral-950 to-neutral-800 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
