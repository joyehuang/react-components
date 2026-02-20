import { RootProvider } from 'fumadocs-ui/provider/next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
import type { ReactNode } from 'react'
import './global.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
