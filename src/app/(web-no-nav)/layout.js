import '@/app/globals.css'
import '@aws-amplify/ui-react/styles.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/dist/react/index'

export default function WebRootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>App</title>
      </head>
      <body className={'flex h-screen w-screen flex-row'}>
        <Analytics />
        <SpeedInsights />
        <main className={'h-full w-full grow'}>{children}</main>
      </body>
    </html>
  )
}
