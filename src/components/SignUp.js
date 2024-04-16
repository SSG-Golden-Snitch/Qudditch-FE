// src/components/SignUp.js
'use client'
// src/app/mobile/register/page.js
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState('') // 이메일 사용 가능 여부
  const router = useRouter()

  // 이메일 중복 확인
  const checkEmail = async () => {
    setLoading(true)
    const response = await fetch('http://localhost:8080/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    setLoading(false)
    if (response.ok) {
      setEmailStatus('사용 가능한 이메일입니다.')
    } else {
      setEmailStatus(data.message || '이메일 중복 확인 중 오류가 발생했습니다.')
    }
  }

  // 이메일 인증 요청
  const requestEmailVerification = async () => {
    setLoading(true)
    const response = await fetch('http://localhost:8080/request-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (!response.ok) {
      setEmailStatus('인증 이메일 발송에 실패했습니다.')
      return
    }
    setEmailStatus('인증 이메일이 발송되었습니다. 이메일을 확인해 주세요.')
  }

  // 폼 제출
  const handleSubmit = async (event) => {
    event.preventDefault()
    // 인증 이메일을 이미 보냈는지 확인
    if (emailStatus !== '인증 이메일이 발송되었습니다. 이메일을 확인해 주세요.') {
      alert('이메일 인증을 먼저 진행해주세요.')
      return
    }
    // 비밀번호 확인
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.')
      return
    }
    // 회원가입 로직 구현...
  }

  return (
    <div className="space-y-4">
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
          <Button onClick={checkEmail} disabled={loading}>
            이메일 중복 확인
          </Button>
        </div>
        {emailStatus && <Alert color="info">{emailStatus}</Alert>}
        <Button
          onClick={requestEmailVerification}
          disabled={loading || emailStatus !== '사용 가능한 이메일입니다.'}
        >
          인증 이메일 보내기
        </Button>
        {/* 나머지 입력 필드와 제출 버튼 */}
      </form>
    </div>
  )
}
