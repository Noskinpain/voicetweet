import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'VoiceTweet — Write in your voice',
  description: 'AI-powered viral content that sounds exactly like you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}