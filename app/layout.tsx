import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { dark } from '@clerk/themes'
import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Visionary.AI - More than just text'
}
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: { colorPrimary: '#22c55e' }
          }}
        >
          <Providers
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <main className="flex flex-col flex-1 bg-muted/50">
                {children}
              </main>
            </div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
