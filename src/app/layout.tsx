import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ABHA HealthQR — Your Health, One QR Away',
  description:
    'ABHA HealthQR makes India\'s digital health ecosystem accessible through QR-based medical record sharing, AI-powered report explanations, and emergency health passports.',
  keywords: 'ABHA, health QR, medical records, Ayushman Bharat, digital health, India',
  openGraph: {
    title: 'ABHA HealthQR',
    description: 'Simplifying India\'s digital health ecosystem',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#0f172a',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#0e7490', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#dc2626', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
