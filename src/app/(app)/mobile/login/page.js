// src/app/mobile/login/page.js
//http://localhost:3000/mobile/login
'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
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
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 쿠키를 포함시키기 위해 설정
      })
      const data = await response.json()
      setLoading(false)
      if (response.ok) {
        setMessage('로그인 성공')
        setTimeout(() => router.push('/main'), 1000) // 로그인 성공시 메인 페이지로 리다이렉트
      } else {
        setMessage(data.message || '로그인 실패')
      }
    } catch (error) {
      setLoading(false)
      setMessage('서버와의 연결에 실패했습니다.')
    }
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
    <div>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
        <Button type="submit" disabled={loading}>
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
        {/* Social Login Buttons */}
        <Button onClick={() => handleSocialSignIn('google')} disabled={loading}>
          Google로 로그인
        </Button>
        <Button onClick={() => handleSocialSignIn('kakao')} disabled={loading}>
          Kakao로 로그인
        </Button>
        <Button onClick={() => handleSocialSignIn('naver')} disabled={loading}>
          Naver로 로그인
        </Button>
      </form>
      {message && <div className="alert">{message}</div>}
    </div>
  )
}
