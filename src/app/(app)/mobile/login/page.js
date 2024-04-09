// src/app/mobile/login/page.js
'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MobileUserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter() // Next.js 라우터 인스턴스를 가져옵니다.

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키를 포함시키기 위해 credentials 추가
      })
      const data = await response.json()

      setLoading(false)

      if (data.error) {
        alert(data.error)
      } else {
        alert('로그인 성공')
        //router.push('/main'); // 사용자를 /main 페이지로 리디렉트합니다.
        router.push('http://localhost:3000/main')
      }
    } catch (error) {
      setLoading(false)
      alert('로그인 중 에러가 발생했습니다.')
    }
  }

  // 소셜 로그인 처리 함수
  const handleSocialSignIn = (provider) => async (e) => {
    e.preventDefault()
    await signIn(provider)
  }

  return (
    <div>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">이메일</Label>
          <TextInput
            id="email"
            type="email"
            placeholder="name@example.com"
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
