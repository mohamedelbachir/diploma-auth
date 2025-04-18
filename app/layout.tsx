import "@/styles/globals.css"
import { Metadata } from "next"
import { SessionProvider } from "@/providers/SessionProvider"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import { getSession } from "./actions"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getSession()
  //console.log(session)
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <main className="flex-1">{children}</main>
                <Footer />
                <TailwindIndicator />
              </ThemeProvider>
              <Toaster />
            </div>
          </SessionProvider>
        </body>
      </html>
    </>
  )
}
