'use client'

import CustomLoading from '@/components/ui/CustomLoading'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { fetchExtended } from '@/utils/fetchExtended'

const KakaoLogin = () => {
  const searchParams = useSearchParams()

  const handleCode = async (code) => {
    await fetch(code)
      .then((res) => {
        if (res.status === 200) return res.json()
        new Error(res.text)
      })
      .then(async (res) => {
        if (res['token'].length > 0 || res['token']) {
          //디바이스 로그인
          const base64Payload = res['token']?.split('.')[1]
          const base64 = base64Payload?.replace(/-/g, '+')?.replace(/_/g, '/')
          const decodedJWT = JSON.parse(
            decodeURIComponent(
              window
                .atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join(''),
            ),
          )

          let userEmail = decodedJWT.sub

          // fcm을 위한 device 토큰 get
          const firebaseApp = initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
          })

          const messaging = getMessaging(firebaseApp)

          try {
            const tokenRes = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FCM_VAP_ID_KEY,
            })
            if (tokenRes) {
              try {
                const deviceRes = await fetchExtended('/api/fcm/login-device', {
                  method: 'POST',
                  body: JSON.stringify({ email: userEmail, deviceToken: tokenRes }),
                })
              } catch (error) {
                new Error(error)
              }
            }
          } catch (error) {
            console.log(error)
            new Error(res.text)
          }
          localStorage.setItem('token', res['token'].replaceAll('"', ''))
          window.location.href = '/m'
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    handleCode(process.env.NEXT_PUBLIC_API_URL + '/kakao?code=' + searchParams.get('code'))
  }, [])

  return <CustomLoading />
}

const SuspenseKakao = () => {
  return (
    <Suspense fallback={<CustomLoading />}>
      <KakaoLogin />
    </Suspense>
  )
}

export default SuspenseKakao
