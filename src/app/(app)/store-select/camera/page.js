'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'

const CameraPage = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [image, setImage] = useState('')

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

  const takePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      // 이미지 데이터를 Base64 문자열로 변환
      const imageDataUrl = canvas.toDataURL('image/png')
      setImage(imageDataUrl)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">QR 인식</h1>
      <div className="relative">
        <video ref={videoRef} className="rounded-lg" autoPlay playsInline></video>
        <FaCircle
          onClick={takePhoto}
          style={{
            position: 'absolute',
            bottom: '10%', // 비디오 하단에서 10%의 위치에 배치
            left: '50%', // 컨테이너 중앙에 배치
            transform: 'translateX(-50%)', // 왼쪽으로 50% 이동하여 중앙 정렬
            fontSize: '48px', // 아이콘 크기
            color: 'white', // 아이콘 색상
            border: '2px solid red', // 테두리 색상
            borderRadius: '50%', // 원형 테두리
            cursor: 'pointer',
          }}
        />

        <Link href={`/store-select/cart`}>
          <FiShoppingCart
            style={{
              position: 'absolute',
              bottom: '13%',
              left: '80%',
              transform: 'translateX(-80%)',
              fontSize: '24px',
              color: 'white',
            }}
          />
        </Link>
      </div>
      {image && <img src={image} className="mt-4 rounded-lg" alt="Snapshot" />}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  )
}

export default CameraPage
