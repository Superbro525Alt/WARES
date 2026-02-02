import type { Metadata } from "next";
import { Space_Grotesk, Spectral } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AnalyticsStub } from "@/components/shared/analytics-stub";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "WARES | STEM Robotics Documentation",
    template: "%s | WARES",
  },
  description:
    "Accessible STEM robotics components with teacher-friendly documentation, guides, and lessons.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      {
        url: "https://warobotics.education/wp-content/uploads/2024/05/cropped-IconLogoWARES-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://warobotics.education/wp-content/uploads/2024/05/cropped-IconLogoWARES-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://warobotics.education/wp-content/uploads/2024/05/cropped-IconLogoWARES-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  other: {
    "msapplication-TileImage":
      "https://warobotics.education/wp-content/uploads/2024/05/cropped-IconLogoWARES-270x270.png",
  },
  openGraph: {
    title: "WARES | STEM Robotics Documentation",
    description:
      "Accessible STEM robotics components with teacher-friendly documentation, guides, and lessons.",
    url: "/",
    siteName: "WARES",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spectral.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <SpeedInsights />
        <Analytics />
        <AnalyticsStub />
      </body>
    </html>
  );
}
