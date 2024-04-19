'use client'
import React, { useState, useEffect, Suspense } from 'react'
import Loading from '@/components/ui/Loading'
import { fetchExtended } from '@/utils/fetchExtended'
import { useRouter, useSearchParams } from 'next/navigation'
import { IoIosArrowBack } from 'react-icons/io'

const PayRequest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const searchParam = useSearchParams()
  const pg = searchParam.get('pg_token')

  useEffect(() => {
    if (pg.length !== 0) {
      setIsLoading(true) // 로딩 시작
      fetchExtended('/api/payment/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pg,
        }),
      })
        .then(() => {
          setIsLoading(false) // 로딩 종료
        })
        .catch(() => {
          setIsLoading(false) // 에러 발생 시 로딩 종료
        })
    }
  }, [pg])

  if (isLoading) {
    return <Loading /> // 로딩 컴포넌트 표시
  }

  return <div>결제가 완료되었습니다.</div>
}

const PayResult = () => {
  const router = useRouter()

  return (
    <div className="flex h-screen flex-col justify-between bg-gray-100">
      <div className="fixed left-0 top-0 z-10 flex w-full justify-between bg-white p-4 shadow-md">
        <button type="button" className="mb-4 flex items-center" onClick={() => router.push('/m')}>
          <IoIosArrowBack className="mr-2" />
          <h2 className="text-m font-semibold">홈</h2>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
          <Suspense fallback={<Loading />}>
            <PayRequest />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default PayResult
