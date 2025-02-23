import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class">
        <body
          className={`${fonts.className} bg-gradient-to-b from-neutral-950 to-neutral-800 text-white dark:from-neutral-950 dark:to-neutral-800`}
        >
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
