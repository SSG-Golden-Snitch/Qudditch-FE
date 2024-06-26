'use client'
import '@/app/globals.css'
import '@aws-amplify/ui-react/styles.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CustomSidebar from '@/components/CustomSidebar'
import { useEffect, useState } from 'react'
import CustomLoading from '@/components/ui/CustomLoading'
import { Analytics } from '@vercel/analytics/react'

export default function WebRootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login/store'
      } else {
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }
  }, [])
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>App</title>
      </head>
      <body className={'flex h-screen w-screen flex-row items-center justify-center'}>
        <Analytics />
        <SpeedInsights />
        {isLoading ? (
          <CustomLoading />
        ) : (
          <>
            <CustomSidebar />
            <main className={'h-full w-full grow'}>{children}</main>
          </>
        )}
      </body>
    </html>
  )
}
