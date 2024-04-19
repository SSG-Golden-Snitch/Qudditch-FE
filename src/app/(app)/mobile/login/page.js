// src/app/mobile/login/page.js
'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { CustomAlert } from '@/components/CustomAlert'
import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'

export default function MobileUserLogin() {
  // 이메일과 비밀번호 상태 관리
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false) // 로딩 상태 관리
  const [message, setMessage] = useState('') // 메시지 상태 관리
  const [fcmToken, setFcmToken] = useState()

  // fcm을 위한 device 토큰 get
  useEffect(() => {}, [])

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.')
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
              fetchExtended('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res['token'].length > 0 || res['token']) {
                    localStorage.setItem('token', res['token'].replaceAll('"', ''))
                    setLoading(false)
                  } else {
                    setMessage('아이디와 비밀번호를 확인하세요')
                    setLoading(false)
                  }
                })
                .then((res) => {
                  if (currentToken) {
                    fetchExtended('/api/fcm/login-device', {
                      method: 'POST',
                      body: JSON.stringify({ email, deviceToken: currentToken }),
                    })
                      .then((res) => {
                        if (res.status === 200) {
                          handleAlert('success', '로그인 성공')
                          setLoading(false)
                          router.push('/m')
                        }
                      })
                      .catch((err) => {
                        console.log(err)
                      })
                  }
                })
                .catch((err) => {
                  setMessage('로그인 실패')
                  setLoading(false)
                })
            } else {
              console.log('No registration token available. Request permission to generate one.')
            }
          })
          .catch((err) => {
            console.log('An error occurred while retrieving token. ', err)
          })
      } else {
        console.log('Unable to get permission to notify.')
      }
    })
  }

  const kakaoLogin = () => {
    Notification.requestPermission().then(
      (permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.')
          window?.Kakao.Auth.authorize({
            redirectUri: `${window.location.origin}/mobile/login/kakao`,
          })
        } else {
          console.log('Unable to get permission to notify.')
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const handleAlert = () => {
    setMessage('')
  }

  const handleSocialSignIn = async (provider) => {
    await signIn(provider) // 'kakao'로 설정해 호출
  }
  return (
    <section className="flex h-screen max-w-full items-center justify-center bg-white">
      {message && <CustomAlert message={message} handleDismiss={handleAlert} />}
      <div className="flex w-full flex-col items-center justify-center px-6 py-8 md:h-screen lg:p-0">
        <span className="pb-1 text-gray-500">딜리셔스 아이디어</span>
        <img
          className="h-50 w-50 mr-2"
          src="/WebLogo.svg"
          alt="logo"
          onClick={() => {
            window.location.href = '/m'
          }}
        ></img>
        <form onSubmit={handleLogin} className="min-w-full space-y-4 md:space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-10 block text-sm font-medium text-gray-900 dark:text-white"
            ></label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 text-gray-900 focus:border-gray-600 focus:ring-gray-600 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-900"
            ></label>
            <input
              id="password"
              type="password"
              required
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50  py-2.5 text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <div className="justify-left flex w-full">
            <a
              href="/mobile/find-account"
              className="text-sm font-medium text-amber-400 hover:underline"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className=" w-full rounded-lg bg-amber-400 px-5 py-2.5 text-center text-sm font-extrabold text-white hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 "
          >
            {loading ? '로그인중...' : '로그인'}
          </button>

          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 ">
            <p className="mx-4 mb-0 text-center font-semibold ">OR</p>
          </div>
        </form>
        <div className="mt-4 min-w-full">
          <button
            onClick={kakaoLogin}
            disabled={loading}
            className="my-3 flex w-full items-center justify-center rounded-lg border border-slate-200 py-2 text-center text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow"
          >
            <img src="/btn_kakao.svg" className="mr-2 h-5 w-5" alt="Google Icon" />
            <span className="dark:text-gray-300">카카오톡으로 로그인하기</span>
          </button>
        </div>
        <div className="flex w-full justify-center">
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            아직 회원이 아니신가요?{' '}
            <a href="/mobile/register" className=" font-medium text-amber-400 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
