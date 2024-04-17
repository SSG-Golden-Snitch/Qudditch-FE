'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { Checkbox, Label, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { HiMail } from 'react-icons/hi'
import { HiLockClosed } from 'react-icons/hi2'
import WebLogo from '/public/WebLogo.svg'

export default function StoreLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetchExtended('/store/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()

      setLoading(false)

      if (data.error) {
        alert(data.error)
      } else {
        if (typeof window === 'undefined') return
        localStorage.setItem('token', data.token)
        window.location.href = '/'
      }
    } catch (error) {
      setLoading(false)
      alert('로그인 중 에러가 발생했습니다.')
    }
  }

  return (
    <section className="flex min-h-screen  items-center justify-center bg-[#e4e4e4] ">
      <div className="mx-auto flex w-1/2 flex-col items-center justify-center  px-6 py-8 md:h-screen lg:py-0">
        <div className="grid  pb-10 text-center">
          <span className="pb-2 text-gray-500">딜리셔스 아이디어</span>
          <WebLogo />
        </div>
        <div className="w-full rounded-lg  bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl"></h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email">이메일</Label>
                </div>
                <TextInput
                  autoComplete="off"
                  type="text"
                  name="email"
                  id="email"
                  icon={HiMail}
                  placeholder="yourmail@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <TextInput
                  autoComplete="off"
                  type="password"
                  name="password"
                  id="password"
                  icon={HiLockClosed}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      required=""
                      color="yellow"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      ID Check
                    </label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-stone-600 hover:underline">
                  비밀번호 찾기
                </a>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                로그인
              </button>
              <p className="text-sm font-light text-gray-500">
                <a
                  href="/login/admin"
                  className="font-medium text-stone-400 underline hover:underline"
                >
                  관리자 로그인
                </a>
              </p>
              <div className="flex w-full justify-center">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  아직 회원이 아니신가요?{' '}
                  <a href="/register" className=" font-medium text-amber-400 hover:underline">
                    회원가입
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
