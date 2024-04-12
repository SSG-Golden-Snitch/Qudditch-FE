// src/app/mobile/find-account/page.js
//http://localhost:3000/mobile/find-account
'use client'

import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FindAccountPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const findEmail = async () => {
    try {
      const response = await fetch('http://localhost:8080/find-email', {
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

  const resetPassword = async () => {
    try {
      const response = await fetch('http://localhost:8080/reset-password', {
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        {message && <Alert color="green">{message}</Alert>}
        {error && <Alert color="red">{error}</Alert>}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">이름</Label>
          <TextInput
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
          <Button onClick={findEmail}>이메일 찾기</Button>
        </div>
        <div>
          <Label htmlFor="email">이메일</Label>
          <TextInput
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
          <Button onClick={resetPassword}>비밀번호 재설정 이메일 받기</Button>
        </div>
      </div>
      <Button color="gray" onClick={() => router.push('/mobile/login')}>
        로그인 화면으로 돌아가기
      </Button>
    </div>
  )
}
