'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Splash from '@/components/Splash'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push('/m') // '/main'은 실제 메인 페이지 경로에 맞게 수정해주세요.
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [router])

  return (
    <div>
      <Splash />
    </div>
  )
}
