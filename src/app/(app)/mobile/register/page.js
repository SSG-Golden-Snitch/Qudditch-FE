// src/app/mobile/register/page.js
'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // 이 컴포넌트는 페이지 디렉토리의 일부여야 라우터에 접근할 수 있다.
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      // 백엔드 API 경로로 수정
      const res = await fetch('http://localhost:8080/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (res.ok) {
        router.push('/mobile/login')
      } else {
        alert(data.message || '회원가입 실패')
      }
    } catch (error) {
      setLoading(false)
      alert(error.message || '회원가입 중 에러가 발생했습니다.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">이메일</Label>
          <TextInput
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
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
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="name">이름</Label>
          <TextInput
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
      </form>
    </div>
  )
}
