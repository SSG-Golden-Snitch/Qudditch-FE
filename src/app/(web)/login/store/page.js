// 점주 로그인 페이지
'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { Button, Label, TextInput } from 'flowbite-react'
import { useRef } from 'react'

const StoreLogin = () => {
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = emailRef.current.value
    const password = passwordRef.current.value

    // 점주 로그인 로직을 여기에 구현합니다.
    try {
      const response = await fetchExtended('/store/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.error) {
        alert('로그인 실패: ' + data.error)
      } else {
        alert('로그인 성공')
        // 토큰을 로컬 스토리지에 저장하고 리다이렉트합니다.
        localStorage.setItem('token', data.token)
        // 로그인 후 페이지 리다이렉션 로직 추가
      }
    } catch (error) {
      alert('로그인 요청 중 오류가 발생했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor="email">이메일</Label>
      <TextInput
        ref={emailRef}
        id="email"
        type="email"
        placeholder="이메일을 입력하세요"
        required
      />

      <Label htmlFor="password">비밀번호</Label>
      <TextInput
        ref={passwordRef}
        id="password"
        type="password"
        placeholder="비밀번호를 입력하세요"
        required
      />

      <Button type="submit">로그인</Button>
    </form>
  )
}

export default StoreLogin
