'use client'

import Script from 'next/script'

const MobileLayout = ({ children }) => {
  return (
    <div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
        strategy="afterInteractive"
        crossOrigin={'anonymous'}
        onLoad={() => {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
          console.log('Kakao SDK loaded')
          console.log(window.Kakao.isInitialized())
        }}
      />
      {children}
    </div>
  )
}

export default MobileLayout
