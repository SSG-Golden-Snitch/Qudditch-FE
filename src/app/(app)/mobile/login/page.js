// src/app/mobile/login/page.js
'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

export default function MobileUserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter() // Next.js 라우터 인스턴스를 가져옵니다.

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
  const handleSocialSignIn = (provider) => async (e) => {
    e.preventDefault()
    // Fetch API로 백엔드에 소셜 로그인 요청 보내기
    await signIn(provider)
  }

  return (
    <div>
      <form className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">이메일</Label>
          <TextInput
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">비밀번호</Label>
          <TextInput
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="button" onClick={handleLogin} disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
        <div className="space-y-2 text-center">
          <Link href="/mobile/register" className="text-blue-500 hover:underline">
            회원가입
          </Link>
          <br />
          <Link href="/mobile/find-account" className="text-blue-500 hover:underline">
            아이디/비밀번호 찾기
          </Link>
        </div>
        {/* 소셜 로그인 버튼 */}
        <Button onClick={handleSocialSignIn('google')} disabled={loading}>
          Google로 로그인
        </Button>
        <Button onClick={handleSocialSignIn('kakao')} disabled={loading}>
          Kakao로 로그인
        </Button>
        <Button onClick={handleSocialSignIn('naver')} disabled={loading}>
          Naver로 로그인
        </Button>
      </form>
    </div>
  )
}
