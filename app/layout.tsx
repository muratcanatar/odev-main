import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "NBA Stats Hub - Live Stats & Analytics",
  description: "Complete NBA statistics, player & team analytics, standings, schedules, and performance insights",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className={`${geistSans.className} font-sans antialiased min-h-screen bg-background`}>
        <SiteHeader />
        <main className="px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
