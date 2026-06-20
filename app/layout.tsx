import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const title = "Get Git — A developer's pull request impact, at a glance";
const description =
  "See what any GitHub developer has actually shipped and reviewed. Get Git turns a username into a focused, beautiful read on their pull request impact — merged work, review footprint, and velocity over time.";

export const metadata: Metadata = {
  metadataBase: new URL("https://get-git-sigma.vercel.app"),
  title: {
    default: title,
    template: "%s · Get Git",
  },
  description,
  applicationName: "Get Git",
  keywords: [
    "GitHub",
    "pull requests",
    "developer profile",
    "open source",
    "code review",
    "contributions",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    images: [
      {
        url: "/home-page-metadata.png",
        width: 1200,
        height: 630,
        alt: "Get Git — a developer's pull request impact, at a glance",
      },
    ],
    siteName: "Get Git",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/home-page-metadata.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
