'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'

import { fetchExtended } from '@/utils/fetchExtended'
import { useParams } from 'next/navigation'
import QRCodeScanner from '@/components/QRCodeScanner'

const CameraPage = () => {
  const { storeId } = useParams()

  console.log(storeId)

  // 웹 카메라
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [image, setImage] = useState('')

  // 장바구니 카운트 추가
  const [cartItemCount, setCartItemCount] = useState(0)

  // 스캔 중복 방지
  const [isScanning, setIsScanning] = useState(false)

  // selectedStore 상태 추가
  const [selectedStore, setSelectedStore] = useState(null)

  // QR 스캔 기능
  const handleScan = async (productId) => {
    // const scanProduct = async (attempt = 0) => {
    //   const maxAttempts = 5
    //   if (attempt >= maxAttempts) {
    //     console.error('최대 시도 횟수에 도달했습니다.')
    //     return
    //   }

    //   const usedPoint = 0 // 사용할 포인트 (예시로 0을 설정)

    //   const requestData = {
    //     storeId,
    //     productId,
    //     usedPoint,
    //   }

    //   try {
    //     const response = await fetchExtended(`/api/cart`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(requestData),
    //     })

    //     if (!response.ok) {
    //       throw new Error('Failed to add item to cart.')
    //     }
    //     console.log('Item added to cart successfully.')
    //     setCartItemCount((prevCount) => prevCount + 1) // 장바구니 카운트 증가
    //   } catch (error) {
    //     console.error('Error adding item to cart:', error)
    //     setTimeout(() => scanProduct(attempt + 1), 100) // 재시도
    //   }
    // }

    // scanProduct() // 최초 스캔 시도

    if (isScanning) return // 이미 스캔 중이면 무시
    setIsScanning(true) // 스캔 시작

    try {
      const response = await fetchExtended(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId,
          productId,
          usedPoint: 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to add item to cart.')

      setCartItemCount((prevCount) => prevCount + 1) // 성공 시 카운트 증가
      console.log('Item added to cart successfully.')
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }

    setTimeout(() => setIsScanning(false), 5000) // 5초 후에 다시 스캔 가능
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">QR 인식</h1>
      <div className="relative">
        <QRCodeScanner onScan={handleScan} />

        <Link href={`/m/store-select/cart`}>
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
          <span>{cartItemCount}</span>
        </Link>
      </div>
      {image && <img src={image} className="mt-4 rounded-lg" alt="Snapshot" />}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  )
}

export default CameraPage

// 1. 바코드 스캔 준비
// 2. QR 코드 스캔
// 3. 스캔 데이터 처리
// 4. 장바구니 페이지 업데이트

// 오류
// 한 번만 인식하는 게 아니라, 연속으로 인식됨
