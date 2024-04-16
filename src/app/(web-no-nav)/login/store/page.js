// src/app/web/login/store/page.js
'use client'
import React from 'react'
import { Button, Label, TextInput, Checkbox } from 'flowbite-react'
import { useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { HiMail } from 'react-icons/hi'
import { HiLockClosed } from 'react-icons/hi2'
import goldesnitch from '/public/goldesnitch.png'
import Image from 'next/image'

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
        sessionStorage.setItem('token', data.token)
        window.location.href = '/'
      }
    } catch (error) {
      setLoading(false)
      alert('로그인 중 에러가 발생했습니다.')
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 ">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <a href="#" className="mb-6 flex items-center text-2xl font-semibold text-gray-900 ">
          <Image src={goldesnitch} className="mr-2 h-8 w-8" alt="logo" />
          Qudditch
        </a>
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-900">
                  이메일
                </label>
                <TextInput
                  autoComplete="off"
                  type="text"
                  name="email"
                  id="email"
                  icon={HiMail}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-gray-900 dark:text-white"
                >
                  비밀번호
                </label>
                <TextInput
                  autoComplete="off"
                  type="password"
                  name="password"
                  id="password"
                  icon={HiLockClosed}
                  placeholder="Password"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <TextInput
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="focus:ring-3 h-3 w-3 rounded border border-gray-300 bg-gray-50 focus:ring-cyan-600"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      ID Check
                    </label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-cyan-700 hover:underline">
                  비밀번호 찾기
                </a>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                로그인
              </button>
              <p className="text-sm font-light text-gray-500">
                관리자로 로그인 하기{'  '}
                <a href="#" className="font-medium text-cyan-700 hover:underline">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
