import '@/app/globals.css'

export default function AppRootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>App</title>
      </head>
      <body className={'flex h-screen w-screen flex-row'}>
        <main className={'h-full w-full grow'}>{children}</main>
      </body>
    </html>
  )
}
