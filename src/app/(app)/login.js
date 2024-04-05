'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

const AppLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetchExtended('/api/app/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.error) {
        alert(`로그인 실패: ${data.error}`)
      } else {
        alert('로그인 성공')
        localStorage.setItem('token', data.token) // 혹은 다른 인증 방식을 사용하세요
        router.push('/main')
      }
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다.', error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email">이메일</Label>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">비밀번호</Label>
        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>
      <Button type="submit">로그인</Button>
    </form>
  )
}

export default AppLogin
