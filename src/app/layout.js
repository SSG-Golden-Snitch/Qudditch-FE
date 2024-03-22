'use client'

import './globals.css'
import CustomSidebar from '@/components/CustomSidebar'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={'flex h-screen w-screen flex-row'}>
        <CustomSidebar />
        <main className={'h-full w-full grow'}>{children}</main>
      </body>
    </html>
  )
}
