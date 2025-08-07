import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TimeFlow - Freelancer Invoice Generator',
  description: 'Generate professional invoices from your time logs in under 60 seconds. Upload CSV from Toggl, Clockify, or any time tracking tool.',
  keywords: ['freelancer', 'invoice', 'time tracking', 'toggl', 'clockify', 'pdf'],
  authors: [{ name: 'TimeFlow' }],
  openGraph: {
    title: 'TimeFlow - Freelancer Invoice Generator',
    description: 'Generate professional invoices from your time logs in under 60 seconds.',
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
        <ThemeProvider>
          <div className="min-h-screen bg-background transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 