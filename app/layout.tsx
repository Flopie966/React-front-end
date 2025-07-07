import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Moneybear',
  description: 'Improved visual search of your second-hand items',
  generator: 'Moneybear',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
