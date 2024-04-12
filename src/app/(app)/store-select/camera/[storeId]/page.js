'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaCircle } from 'react-icons/fa'
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

  // selectedStore 상태 추가
  const [selectedStore, setSelectedStore] = useState(null)

  // useEffect(() => {
  //   // storeId가 유효한 경우에만 selectedStore 상태를 업데이트합니다.
  //   if (storeId) {
  //     setSelectedStore(storeId);
  //   }
  // }, [storeId]);

  // QR 스캔 기능
  const handleScan = async (productId) => {
    const scanProduct = async (attempt = 0) => {
      const maxAttempts = 5
      if (attempt >= maxAttempts) {
        console.error('최대 시도 횟수에 도달했습니다.')
        return
      }

      const usedPoint = 0 // 사용할 포인트 (예시로 0을 설정)

      const requestData = {
        storeId,
        productId,
        usedPoint,
      }

      try {
        const response = await fetchExtended(`/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        if (!response.ok) {
          throw new Error('Failed to add item to cart.')
        }
        console.log('Item added to cart successfully.')
        setCartItemCount((prevCount) => prevCount + 1) // 장바구니 카운트 증가
      } catch (error) {
        console.error('Error adding item to cart:', error)
        setTimeout(() => scanProduct(attempt + 1), 100) // 재시도
      }
    }

    scanProduct() // 최초 스캔 시도
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">QR 인식</h1>
      <div className="relative">
        <QRCodeScanner onScan={handleScan} />
        {/* <FaCircle
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
        /> */}

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
        <span>{cartItemCount}</span>
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
