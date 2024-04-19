'use client'

import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'

import { fetchExtended } from '@/utils/fetchExtended'
import { Button, Label, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'

function Component() {
  const [fcmToken, setFcmToken] = useState()

  // fcm을 위한 device 토큰 get
  useEffect(() => {
    const firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
    })

    const messaging = getMessaging(firebaseApp)

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FCM_VAP_ID_KEY,
    })
      .then((currentToken) => {
        if (currentToken) {
          setFcmToken(currentToken)
        } else {
          console.log('No registration token available. Request permission to generate one.')
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
      })
  }, [])

  const loginRef = useRef()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      email: loginRef.current?.elements.email.value,
      password: loginRef.current?.elements.password.value,
    }
    await fetchExtended('/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (typeof window !== 'undefined') {
          if (data.error) {
            alert(data.error)
          } else {
            const loginDeviceHandler = async () => {
              if (fcmToken == null) {
                alert('토큰을 아직 받아오지 못했습니다. 잠시후 다시시도 바랍니다.')
                return
              }
              const resp = await fetch('https://dev.qudditch.dawoony.com/api/fcm/login-device', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: loginRef.current?.elements.email.value,
                  deviceToken: fcmToken,
                }),
              })

              return resp
            }

            const resp = await loginDeviceHandler()

            if (resp == null || (resp != null && resp.status !== 200)) {
              alert('LOGIN DEVICE FAIL')
              return
            }

            alert('Login success')
            localStorage.setItem('token', data['token'])

            // 메인페이지 이동
            window.location.href = '/m'
          }
        }
      })
  }

  //   중간정렬
  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit} ref={loginRef}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput id="email" type="email" placeholder="name@flowbite.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput id="password" type="password" required />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default Component
