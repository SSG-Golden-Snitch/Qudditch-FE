'use client'

import Script from 'next/script'

const LoginLayout = ({ children }) => {
  return (
    <div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
        strategy="afterInteractive"
        // crossOrigin={'anonymous'}
        onReady={() => {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
        }}
      />
      {children}
    </div>
  )
}

export default LoginLayout
