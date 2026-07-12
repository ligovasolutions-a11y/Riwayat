import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Riwaayat Jewels – Where Heritage Meets Time',
  description: 'Crafting timeless jewellery and curating exceptional timepieces for generations. Luxury jewellery and Swiss watches in India.',
  keywords: 'luxury jewellery, swiss watches, diamond jewellery, bridal jewellery, Riwaayat Jewels',
  openGraph: {
    title: 'Riwaayat Jewels',
    description: 'Where Heritage Meets Time',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'JewelryStore',
              name: 'Riwaayat Jewels',
              description: 'Luxury jewellery and curated timepieces',
              url: 'https://riwaayatjewels.com',
              telephone: '+91-99999-88888',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Luxury Lane',
                addressLocality: 'Mumbai',
                addressCountry: 'IN',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
