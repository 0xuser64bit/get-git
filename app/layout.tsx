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
  title: "Get Git - Explore GitHub Profiles in a Beautiful Way",
  description: "Get Git allows you to explore GitHub profiles in a beautiful and interactive way. Search for any GitHub username to see stats, repositories, and contributions.",
  openGraph: {
    type: "website",
    url: "https://get-git-sigma.vercel.app/",
    title: "Get Git - Explore GitHub Profiles in a Beautiful Way",
    description: "Get Git allows you to explore GitHub profiles in a beautiful and interactive way. Search for any GitHub username to see stats, repositories, and contributions.",
    images: [
      {
        url: "/home-page-metadata.png",
        width: 1200,
        height: 630,
        alt: "Get Git - Explore GitHub Profiles",
      },
    ],
    siteName: "Get Git"
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Git - Explore GitHub Profiles in a Beautiful Way",
    description: "Get Git allows you to explore GitHub profiles in a beautiful and interactive way. Search for any GitHub username to see stats, repositories, and contributions.",
    images: ["/home-page-metadata.png"],
  }
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
