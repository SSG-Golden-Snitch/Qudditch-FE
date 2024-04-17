'use client'

import Loading from '@/components/ui/Loading'
import { fetchExtended } from '@/utils/fetchExtended'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const KakaoLogin = () => {
  const searchParams = useSearchParams()
  const [data, setData] = useState(null)

  const handleCode = async (code) => {
    await fetchExtended('/login/kakao?code=' + code)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data['res'].hasOwnProperty('email')) {
          setData(data['res'])
        }
      })
  }
  useEffect(() => {
    if (data === null) {
      handleCode(searchParams.get('code'))
    }
  }, [])

  return <div>{data ? JSON.stringify(data) : 'loading'}</div>
}

const SuspenseKakao = () => {
  return (
    <Suspense fallback={<Loading />}>
      <KakaoLogin />
    </Suspense>
  )
}

export default SuspenseKakao
