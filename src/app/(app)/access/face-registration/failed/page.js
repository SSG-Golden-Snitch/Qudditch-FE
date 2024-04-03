'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from 'flowbite-react'
import { Suspense } from 'react'

const RegistrationFailedPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">등록 실패</h1>
      <p className="mb-2 text-lg text-gray-700">안면 등록에 실패하였습니다.</p>
      <p className="mb-8 text-lg text-red-500">{searchParams.get('msg')}</p>
      <div className="flex flex-col space-y-4">
        <Button onClick={() => router.back()}>재시도</Button>
        <Button onClick={() => router.push('/main')}>홈으로 가기</Button>
      </div>
    </div>
  )
}

const WrappedRegistrationFailedPage = () => {
  return (
    <Suspense fallback={<></>}>
      <RegistrationFailedPage />
    </Suspense>
  )
}

export default WrappedRegistrationFailedPage
