// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FastMVP Core - 5 Day Sprint Framework',
  description: 'Build production-ready MVPs in 5 days with AI-powered development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          <main className="flex-1 ml-64 bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
