// src/app/web/login/admin/page.js
'use client'
import { Button, Label, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      alert('로그인 중 에러가 발생했습니다.')
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
            placeholder="admin@example.com"
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
      </form>
    </div>
  )
}
