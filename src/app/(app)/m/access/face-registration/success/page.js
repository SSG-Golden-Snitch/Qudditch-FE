'use client'

import { Button } from 'flowbite-react'
import { useRouter } from 'next/navigation'

const RegistrationSuccessPage = () => {
  const router = useRouter()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">등록 성공</h1>
      <p className="mb-8 text-lg text-gray-700">안면 등록이 성공적으로 완료되었습니다.</p>
      <Button onClick={() => router.push('/m')}>계속하기</Button>
    </div>
  )
}

export default RegistrationSuccessPage
