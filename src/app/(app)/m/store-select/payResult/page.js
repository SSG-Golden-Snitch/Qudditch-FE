'use client'
import { fetchExtended } from '@/utils/fetchExtended'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { IoIosArrowBack } from 'react-icons/io'

const PayRequest = () => {
  const searchParam = useSearchParams()
  const pg = searchParam.get('pg_token')

  if (pg.length !== 0) {
    fetchExtended('/api/payment/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pg,
      }),
    })
  }
  return <div></div>
}

const PayResult = () => {
  return (
    <div className="flex h-screen flex-col justify-between bg-gray-100">
      <div className="fixed left-0 top-0 z-10 flex w-full justify-between bg-white p-4 shadow-md">
        <button
          type="button"
          className="mb-4 flex items-center"
          onClick={() => window.history.back()}
        >
          <IoIosArrowBack className="mr-2" />
          <h2 className="text-xl font-bold">장바구니</h2>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
          <p className="mt-4 text-gray-800">결제가 완료되었습니다.</p>
        </div>
      </div>

      <Suspense fallback={<div>Loading</div>}>
        <PayRequest />
      </Suspense>
    </div>
  )
}

export default PayResult
