import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex-mono'
})

export const metadata: Metadata = {
  title: 'Explore Mustangs - Western University Tech Network',
  description: 'Connect with Western University students and alumni in tech. Discover talented developers, designers, and entrepreneurs from Western University.',
  keywords: [
    'Western University',
    'UWO',
    'tech network',
    'students',
    'alumni',
    'developers',
    'designers',
    'entrepreneurs',
    'London Ontario',
    'university network'
  ],
  authors: [{ name: 'Explore Mustangs' }],
  creator: 'Explore Mustangs',
  publisher: 'Explore Mustangs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://exploremustangs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Explore Mustangs - Western University Tech Network',
    description: 'Connect with Western University students and alumni in tech. Discover talented developers, designers, and entrepreneurs from Western University.',
    url: 'https://exploremustangs.com',
    siteName: 'Explore Mustangs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Explore Mustangs - Western University Tech Network',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Mustangs - Western University Tech Network',
    description: 'Connect with Western University students and alumni in tech. Discover talented developers, designers, and entrepreneurs from Western University.',
    images: ['/twitter-image.png'],
    creator: '@exploremustangs',
    site: '@exploremustangs',
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
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
