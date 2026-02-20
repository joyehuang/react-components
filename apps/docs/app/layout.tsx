import { RootProvider } from 'fumadocs-ui/provider/next'
import { Space_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'
import './global.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
