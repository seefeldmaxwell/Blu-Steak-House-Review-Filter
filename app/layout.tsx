import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blu' Steak House - Customer Feedback",
  description: "Share your experience with Blu' Steak House",
  icons: {
    icon: "https://imagedelivery.net/_YTjg6tu3dV3JnyQiIl6NQ/b3bc47be-de73-4925-ad42-10a1adb82200/public",
    apple: "https://imagedelivery.net/_YTjg6tu3dV3JnyQiIl6NQ/b3bc47be-de73-4925-ad42-10a1adb82200/public",
    shortcut: "https://imagedelivery.net/_YTjg6tu3dV3JnyQiIl6NQ/b3bc47be-de73-4925-ad42-10a1adb82200/public",
  },
  openGraph: {
    title: "Blu' Steak House - Customer Feedback",
    description: "Share your experience with Blu' Steak House",
    images: [
      {
        url: "https://imagedelivery.net/_YTjg6tu3dV3JnyQiIl6NQ/b3bc47be-de73-4925-ad42-10a1adb82200/public",
        width: 800,
        height: 600,
        alt: "Blu' Steak House Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blu' Steak House - Customer Feedback",
    description: "Share your experience with Blu' Steak House",
    images: ["https://imagedelivery.net/_YTjg6tu3dV3JnyQiIl6NQ/b3bc47be-de73-4925-ad42-10a1adb82200/public"],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
