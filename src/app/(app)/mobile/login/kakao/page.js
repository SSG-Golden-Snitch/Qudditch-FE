'use client'

import Loading from '@/components/ui/Loading'
import { fetchExtended } from '@/utils/fetchExtended'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const KakaoLogin = () => {
  const searchParams = useSearchParams()
  const [data, setData] = useState(null)

  const handleCode = async (code) => {
    await fetchExtended('/kakao?code=' + code).then((data) => {
      setData(data)
      // console.log(data)
      // if (data['res'].hasOwnProperty('email')) {
      // }
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
