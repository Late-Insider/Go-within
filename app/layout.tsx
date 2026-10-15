import type { Metadata, Viewport } from 'next'
import './globals.css'

const bronzeKeyFavicon = 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 48%22 fill=%22none%22%3E%3Ccircle cx=%2216%22 cy=%2215%22 r=%228.25%22 stroke=%22%23c28b61%22 stroke-width=%221.8%22/%3E%3Ccircle cx=%2216%22 cy=%2215%22 r=%223.1%22 stroke=%22%23c28b61%22 stroke-width=%221.4%22/%3E%3Cpath d=%22M22.4 20.8 38.8 37.2M31.4 29.8l3.5-3.5M35.5 33.9l3.1-3.1%22 stroke=%22%23c28b61%22 stroke-width=%222.2%22 stroke-linecap=%22round%22/%3E%3C/svg%3E'

export const metadata: Metadata = {
  metadataBase: new URL('https://gowithin.app'),
  title: 'Go Within | Original Stories, Essays & Creative Worlds',
  description: 'Go Within is an unfolding creative universe of original stories, literary essays and visual storytelling. Enter Echo and discover a world shaped by curiosity.',
  keywords: ['Go Within', 'Echo essays', 'original fiction', 'reflective essays', 'literary publication', 'creative universe'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'GO WITHIN — Some doors open inward.',
    description: 'Stories to enter. Questions to carry.',
    url: '/',
    siteName: 'GO WITHIN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GO WITHIN — Some doors open inward.',
    description: 'An unfolding universe of stories, questions, and unexpected encounters.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: bronzeKeyFavicon,
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
