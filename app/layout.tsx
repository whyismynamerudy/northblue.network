import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex-mono'
})

export const metadata: Metadata = {
  title: 'North Blue Network',
  description: 'Meet the builders, creators, and dreamers of the University of Toronto.',
  keywords: [
    'University of Toronto',
    'U of T',
    'North Blue',
    'Toronto',
    'tech network',
    'students',
    'alumni',
    'developers',
    'designers',
    'entrepreneurs',
    'Canada',
    'UTSG',
    'UTM',
    'UTSC',
    'St. George',
    'University of Toronto St. George',
    'University of Toronto Scarborough',
    'University of Toronto Mississauga',
    'UofT students',
    'UofT alumni',
    'UofT engineering',
    'UofT computer science',
    'Rotman',
    'Rotman School of Management',
    'UofT network',
    'North Blue Network',
    'university network'
  ],
  authors: [
    { name: 'Rudraksh Monga', url: 'https://x.com/wimnr9745' },
    { name: 'Karl-Alexandre Michaud', url: 'https://www.linkedin.com/in/karlmichaud/' }
  ],
  creator: 'Rudraksh Monga & Karl-Alexandre Michaud',
  publisher: 'Rudraksh Monga & Karl-Alexandre Michaud',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://northblue.network'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'North Blue Network',
    description: 'Meet the builders, creators, and dreamers of the University of Toronto.',
    url: 'https://northblue.network',
    siteName: 'North Blue Network',
    images: [
      {
        url: '/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'North Blue Network',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'North Blue Network',
    description: 'Meet the builders, creators, and dreamers of the University of Toronto.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: ['/favicon.png'],
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JX0C097Y1K"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JX0C097Y1K');
            `,
          }}
        />
      </head>
      <body className={ibmPlexMono.variable}>{children}</body>
    </html>
  )
}
