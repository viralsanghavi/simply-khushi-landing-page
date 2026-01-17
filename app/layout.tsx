import type React from "react"
import type { Metadata } from "next"
import { Poppins, Berkshire_Swash } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
})
const berkshireSwash = Berkshire_Swash({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-berkshire",
})

export const metadata: Metadata = {
  title: "SimplyKhushi - Joyful Gifting Made Simple",
  description: "Premium wellness-focused gifts that spread joy and happiness. Curated gift hampers for every occasion.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${berkshireSwash.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
