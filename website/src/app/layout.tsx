import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview AI — Real-Time Technical Interview Co-Pilot",
  description: "Ace every technical interview with real-time speech transcription, zero hallucinations, instant Python/Java code switching, and conversational answers. 100% Free & Open Source.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] text-white min-h-screen antialiased selection:bg-[#00ff88] selection:text-black">
        {children}
      </body>
    </html>
  );
}
