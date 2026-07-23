import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vanthex IA - Sua Consultora de IA para Mercado Digital',
  description: 'Consultoria virtual com inteligência artificial para gestores de tráfego, agências, infoprodutores, e-commerces e afiliados.',
  keywords: ['IA', 'inteligência artificial', 'marketing digital', 'consultoria', 'tráfego pago', 'afiliados'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
