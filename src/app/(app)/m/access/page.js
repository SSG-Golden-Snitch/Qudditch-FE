'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { useQRCode } from 'next-qrcode'
import { useEffect, useState } from 'react'
import { FaArrowsRotate } from 'react-icons/fa6'
import { TbFaceId } from 'react-icons/tb'

import { Progress, Spinner } from 'flowbite-react'
import { IoIosArrowBack } from 'react-icons/io'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Access() {
  const router = useRouter()
  const [reqCode, setReqCode] = useState('')
  const [progress, setProgress] = useState(100)
  const [time, setTime] = useState(0)
  const [expired, setExpired] = useState(false)
  const { Canvas } = useQRCode()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = sessionStorage.get('token')
    if (!token) {
      router.push('/mobile/login')
    }
  })

  const accessReqUrl = new URL(apiUrl + '/api/access/qrcode/request')

  const handleAccess = async () => {
    await fetchExtended(accessReqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setReqCode(res.data)
        console.log(res.data)
      })
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleProgress = () => {
    const totalTime = 30
    let currentTime = totalTime

    setProgress(100)
    setTime(currentTime)

    const interval = setInterval(() => {
      currentTime -= 1
      setTime(currentTime)

      if (currentTime <= 0) {
        clearInterval(interval)
        setExpired(true)
      }
    }, 1000)

    setTimeout(() => {
      setProgress(0)
    }, totalTime * 1000)
  }

  const startProgressAnimation = () => {
    const totalTime = 30
    const totalSteps = totalTime * 53

    let currentStep = 0
    const decrementAmount = 100 / totalSteps

    const interval = setInterval(() => {
      currentStep++
      const currentProgress = 100 - currentStep * decrementAmount
      setProgress(Math.max(0, currentProgress))

      if (currentStep >= totalSteps) {
        clearInterval(interval)
      }
    }, 1000 / 60)
  }

  useEffect(() => {
    handleAccess()
    handleProgress()
    startProgressAnimation()
  }, [])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    if (time <= 0) return '인증시간이 만료되었습니다.'
    return `인증시간 ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const reloadQRCode = () => {
    setExpired(false)
    handleAccess()
    handleProgress()
    startProgressAnimation()
  }

  return (
    <div className="relative grid h-screen place-items-center bg-slate-700 text-white">
      <div
        className="absolute left-3 top-3 flex cursor-pointer items-center p-4"
        onClick={handleGoBack}
      >
        <IoIosArrowBack className="mr-2" /> 출입 QR
      </div>
      <div className="mt-24 flex h-2/3 flex-col items-center justify-center rounded-lg bg-white p-16 text-black">
        <h1 className="mb-2 text-xl font-semibold">출입인증</h1>
        <h1 className="mb-8 text-sm">QR코드를 카메라에 인식해주세요</h1>

        <div className="flex w-full justify-center">
          <div className="h-full w-full">
            {reqCode && !expired ? (
              <Canvas
                text={reqCode}
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 1,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: '#020617',
                    light: '#ffffff',
                  },
                }}
              />
            ) : (
              <div className="flex justify-center">
                {expired ? (
                  <div className="relative">
                    <Canvas
                      text={reqCode}
                      options={{
                        errorCorrectionLevel: 'M',
                        margin: 1,
                        scale: 4,
                        width: 200,
                        color: {
                          dark: '#020617',
                          light: '#ffffff',
                        },
                      }}
                    />
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white opacity-90">
                      <FaArrowsRotate
                        className="absolute left-1/2 -translate-x-1/2 transform cursor-pointer text-3xl text-gray-800"
                        onClick={reloadQRCode}
                      />
                    </div>
                  </div>
                ) : (
                  <Spinner size="xl" aria-label="Loading spinner" />
                )}
              </div>
            )}
          </div>
        </div>

        {reqCode && (
          <>
            <div className="w-full pt-5">
              <Progress progress={progress} color="dark" />
            </div>
            <div className="pt-2 text-xs text-gray-400">{formatTime(time)} </div>
          </>
        )}
      </div>
      <Link
        href={'/m/access/face-registration'}
        className="flex items-center justify-center gap-1 text-center text-sm"
      >
        얼굴인식으로 인증하기 <TbFaceId />
      </Link>
    </div>
  )
}
