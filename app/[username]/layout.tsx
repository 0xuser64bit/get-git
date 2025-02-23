export async function generateMetadata() {
  // Todo: Add dynamic metadata
  return {
    title: "Get Git",
    description: "Explore GitHub profiles in more Stylish ways",
    openGraph: {
      type: "website",
      url: "https://get-git-sigma.vercel.app/",
      title: "Get Git",
      description: "Explore GitHub profiles in more Stylish ways",
      images: [
        {
          url: "/home-page-metadata.png",
          width: 1200,
          height: 630,
          alt: "Get Git",
        },
      ],
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
