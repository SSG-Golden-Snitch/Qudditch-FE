// src/app/web/login/admin/page.js
'use client'
import React from 'react'
import { Button, Label, TextInput, Checkbox } from 'flowbite-react'
import { useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { HiMail } from 'react-icons/hi'
import WebLogo from '/public/WebLogo.svg'
import { HiLockClosed } from 'react-icons/hi2'
import { CustomAlert } from '@/components/CustomAlert'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAlert = (message = '') => {
    setMessage(message)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetchExtended('/admin/login', {
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
        window.location.href = '/manager'
      }
    } catch (error) {
      setLoading(false)
      setMessage('아이디와 비밀번호를 확인하세요')
    }
  }

  return (
    <section className="flex min-h-screen  items-center justify-center bg-gray-50 ">
      {message && <CustomAlert message={message} handleDismiss={handleAlert} />}
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
                  type="text"
                  name="email"
                  id="email"
                  icon={HiMail}
                  placeholder="kdt4@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <TextInput
                  type="password"
                  name="password"
                  id="password"
                  icon={HiLockClosed}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  href="/login/store"
                  className="font-medium text-stone-400 underline hover:underline"
                >
                  사업자 로그인
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
