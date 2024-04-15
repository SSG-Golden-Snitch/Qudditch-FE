'use client'

import React, { useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'

import { fetchExtended } from '@/utils/fetchExtended'
import { useParams } from 'next/navigation'
import QRCodeScanner from '@/components/QRCodeScanner'

const CameraPage = () => {
  const { storeId } = useParams()
  const [errorMessage, setErrorMessage] = useState('')

  // 장바구니 카운트 추가
  const [cartItemCount, setCartItemCount] = useState(0)

  // 스캔 중복 방지
  const [isScanning, setIsScanning] = useState(false)

  // 최근 스캔한 제품 ID 저장
  const [lastScannedId, setLastScannedId] = useState(null)

  // QR 스캔 기능
  const handleScan = async (result) => {
    const productId = result // 가정: result가 제품 ID를 바로 반환

    if (isScanning || productId === lastScannedId) return // 이미 스캔 중이거나, 최근 스캔한 제품과 동일한 경우 무시
    setIsScanning(true)
    setLastScannedId(productId) // 스캔한 제품 ID 업데이트

    try {
      const response = await fetchExtended(`/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId,
          productId: result,
          usedPoint: 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to add item to cart.')

      setCartItemCount((prevCount) => prevCount + 1) // 성공 시 카운트 증가
      console.log('Item added to cart successfully.')
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }

    setTimeout(() => setIsScanning(false), 1000) // 1초 후에 다시 스캔 가능
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-4 flex items-center">
        <h1 className="text-2xl font-bold">제품QR을 인식해주세요</h1>
        {/* <div className="relative"> */}
        <Link href={`/m/store-select/cart`}>
          <FiShoppingCart className="text-2xl" />
          <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-sm font-semibold text-white">
            {cartItemCount}
          </span>
        </Link>
        {/* </div> */}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}{' '}
        {/* 에러 메시지 표시 */}
      </div>

      <QRCodeScanner onScan={handleScan} />
    </div>
  )
}

export default CameraPage

// 1. 바코드 스캔 준비
// 2. QR 코드 스캔
// 3. 스캔 데이터 처리
// 4. 장바구니 페이지 업데이트
