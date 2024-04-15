'use client'
import { fetchExtended } from '@/utils/fetchExtended'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const Test = () => {
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
  return <div>{pg}</div>
}

const Test2 = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Test />
    </Suspense>
  )
}

export default Test2
