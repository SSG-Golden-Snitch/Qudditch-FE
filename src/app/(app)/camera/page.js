'use client'

import React, { useEffect, useRef } from 'react'

const CameraPage = () => {
  const videoRef = useRef(null)

  useEffect(() => {
    // 사용자의 웹 카메라 접근
    const getVideo = async () => {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
        // videoRef가 현재 가리키고 있는 HTMLVideoElement에 스트림 할당
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream
        }
      } catch (error) {
        console.error('카메라에 접근할 수 없습니다.', error)
      }
    }

    getVideo()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">카메라</h1>
      <video ref={videoRef} className="rounded-lg" autoPlay playsInline></video>
    </div>
  )
}

export default CameraPage
