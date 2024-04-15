'use client'

import '@/app/globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CustomSidebar from '@/components/CustomSidebar'
import { useEffect, useState } from 'react'
import Loading from '@/components/ui/Loading'

export default function WebRootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token')
      if (!token) {
        window.location.href = '/login/store'
      } else {
        // 1초 후에 로딩을 끝낸다.
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
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
        <SpeedInsights />
        {isLoading ? (
          <Loading />
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
