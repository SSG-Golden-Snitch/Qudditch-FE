'use client'

import Loading from '@/components/ui/Loading'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const KakaoLogin = () => {
  const searchParams = useSearchParams()

  const handleCode = async (code) => {
    await fetch(code)
      .then((res) => {
        if (res.status === 200) return res.json()
        new Error(res.text)
      })
      .then((res) => {
        if (res['token'].length > 0 || res['token']) {
          localStorage.setItem('token', res['token'].replaceAll('"', ''))
          window.location.href = '/m'
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    handleCode(process.env.NEXT_PUBLIC_API_URL + '/kakao?code=' + searchParams.get('code'))
  }, [])

  return <Loading />
}

const SuspenseKakao = () => {
  return (
    <Suspense fallback={<Loading />}>
      <KakaoLogin />
    </Suspense>
  )
}

export default SuspenseKakao
