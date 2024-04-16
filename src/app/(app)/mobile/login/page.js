// src/app/mobile/login/page.js
'use client'

import { signIn } from 'next-auth/react'

import { fetchExtended } from '@/utils/fetchExtended'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MobileUserLogin() {
  // 이메일과 비밀번호 상태 관리
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false) // 로딩 상태 관리
  const [message, setMessage] = useState('') // 메시지 상태 관리
  const router = useRouter()

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    await fetchExtended('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['token'].length > 0) {
          localStorage.setItem('token', res['token'].replaceAll('"', ''))
          window.location.href = '/m'
        }
      })
      .catch((err) => {
        setMessage('로그인 실패')
      })
  }

  // 소셜 로그인 처리 함수
  const handleSocialSignIn = async (provider) => {
    setLoading(true)
    const result = await signIn(provider, { redirect: false, callbackUrl: '/main' })
    if (result.error) {
      setMessage(result.error)
      setLoading(false)
    } else if (result.url) {
      window.location.href = result.url // 성공적으로 인증된 경우 리다이렉트
    }
  }

  return (
    <section className="flex h-screen max-w-screen-xl items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <span className="pb-1 text-gray-500">딜리셔스 아이디어</span>
        <img className="h-50 w-50 mr-2" src="/WebLogo.svg" alt="logo"></img>
        <form onSubmit={handleLogin} className="space-y-4 md:space-y-4">
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
            ></label>
            <input
              id="password"
              type="password"
              required
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <div className="flex w-full justify-end">
            <a
              href="/mobile/find-account"
              className="text-sm  font-medium text-amber-400 hover:underline"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className=" w-full rounded-lg bg-amber-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 dark:bg-amber-600"
          >
            로그인
          </button>

          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 ">
            <p className="mx-4 mb-0 text-center font-semibold ">OR</p>
          </div>
          <div className="mt-4">
            <a href="#" className="block">
              <button
                onClick={() => handleSocialSignIn('google')}
                disabled={loading}
                className="my-3 flex w-full items-center justify-center rounded-lg border border-slate-200 py-2 text-center text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow"
              >
                <img src="/btn_google.svg" className="mr-2 h-5 w-5" alt="Google Icon" />
                <span className="dark:text-gray-300">Login with Google</span>
              </button>
            </a>

            <a href="#" className="block">
              <button
                onClick={() => handleSocialSignIn('kakao')}
                disabled={loading}
                className="my-3 flex w-full items-center justify-center rounded-lg border border-slate-200 py-2 text-center text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow"
              >
                <img src="/btn_kakao.svg" className="mr-2 h-5 w-5" alt="Google Icon" />
                <span className="dark:text-gray-300">Login with Kakao</span>
              </button>
            </a>
            <a href="#" className="block">
              <button
                onClick={() => handleSocialSignIn('naver')}
                disabled={loading}
                className="my-3 flex w-full items-center justify-center rounded-lg border border-slate-200 py-2 text-center text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow"
              >
                <img src="/btn_naver.svg" className="mr-2 h-5 w-5" alt="Google Icon" />
                <span className="dark:text-gray-300">Login with Naver</span>
              </button>
            </a>
          </div>
          <div className="flex w-full justify-center">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              아직 회원이 아니신가요?{' '}
              <a href="/mobile/register" className=" font-medium text-amber-400 hover:underline">
                회원가입
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
