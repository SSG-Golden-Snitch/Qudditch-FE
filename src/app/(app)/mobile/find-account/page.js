// src/app/mobile/find-account/page.js
//http://localhost:3000/mobile/find-account
'use client'

import { Alert, Label } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

export default function FindAccountPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  //  이름을 이용해서 이메일 찾기
  const findEmail = async () => {
    try {
      const response = await fetchExtended('/find-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        const email = await response.text()
        setMessage(`회원님의 이메일은 다음과 같습니다: ${email}`)
        setError('')
      } else {
        throw new Error('해당 이름으로 등록된 이메일이 없습니다.')
      }
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  // 이메일을 이용해서 비밀번호 재설정 요청
  const resetPassword = async () => {
    try {
      const response = await fetchExtended('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해주세요.')
        setError('')
      } else {
        throw new Error('이메일 전송에 실패하였습니다. 다시 시도해주세요.')
      }
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  // 실제로 '이메일 찾기'를 수행하는 함수
  const handleFindEmail = async () => {
    setError('')
    setMessage('')
    if (name) {
      try {
        const response = await fetchExtended('/find-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        })
        if (response.ok) {
          const data = await response.json()
          setMessage(`회원님의 이메일은 ${data.email}입니다.`)
        } else {
          setError('해당 이름으로 등록된 이메일이 없습니다.')
        }
      } catch (err) {
        setError('서버와의 통신에 문제가 있습니다.')
      }
    } else {
      setError('이름을 입력해주세요.')
    }
  }

  // 실제로 '비밀번호 재설정 이메일 보내기'를 수행하는 함수
  const handleResetPassword = async () => {
    setError('')
    setMessage('')
    if (email) {
      try {
        const response = await fetchExtended('/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })
        if (response.ok) {
          setMessage('비밀번호 재설정 이메일을 확인해 주세요.')
        } else {
          setError('이메일 전송에 실패하였습니다. 다시 시도해 주세요.')
        }
      } catch (err) {
        setError('서버와의 통신에 문제가 있습니다.')
      }
    } else {
      setError('이메일을 입력해주세요.')
    }
  }

  return (
    <section className="flex h-screen max-w-screen-xl items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <span className="pb-1 text-gray-500">딜리셔스 아이디어</span>
        <img className="h-50 w-50 mr-2" src="/WebLogo.svg" alt="logo"></img>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <Label htmlFor="name">이름으로 Email 찾기</Label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className=" w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleFindEmail}
            className=" w-full rounded-lg bg-amber-400 px-5 py-2.5 text-center text-sm font-extrabold text-white hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 dark:bg-amber-600"
          >
            이메일찾기
          </button>
          <div>
            <Label htmlFor="email">Email로 비밀번호 재설정하기</Label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className=" w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleResetPassword}
            className=" w-full rounded-lg bg-amber-400 px-5 py-2.5 text-center text-sm font-extrabold text-white hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 dark:bg-amber-600"
          >
            인증메일발송
          </button>
        </div>

        <div className="mb-4">
          {message && <Alert color="green">{message}</Alert>}
          {error && <Alert color="red">{error}</Alert>}
        </div>
        <div className="flex w-full justify-end">
          <button
            type="button"
            color="gray"
            onClick={() => router.push('/mobile/login')}
            className="mb-2 me-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    </section>
  )
}
