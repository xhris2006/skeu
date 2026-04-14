import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'skeu - Your Skin, Your Glow',
  description: 'Cosmetiques premium pour sublimer votre peau. Livraison rapide au Cameroun.',
  keywords: 'cosmetiques, skincare, beaute, Cameroun, FCFA',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'skeu - Your Skin, Your Glow',
    description: 'Cosmetiques premium pour sublimer votre peau.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
