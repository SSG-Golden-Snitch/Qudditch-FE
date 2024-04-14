'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchExtended } from '@/utils/fetchExtended'

const Receipt = () => {
  const { partnerOrderId } = useParams() // URL에서 partnerOrderId 추출
  const [orderDetails, setOrderDetails] = useState([])

  useEffect(() => {
    async function fetchReceipt() {
      if (!partnerOrderId) return // partnerOrderId가 없으면 실행 중지

      const endpoint = `/api/order/receipt?partnerOrderId=${partnerOrderId}` // API 엔드포인트 구성
      try {
        const response = await fetchExtended(endpoint)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data) // 영수증 데이터 상태 업데이트
        } else {
          throw new Error('영수증 정보를 불러오는 데 실패했습니다.')
        }
      } catch (error) {
        console.error('영수증 정보를 불러오는 중 오류 발생:', error)
      }
    }

    fetchReceipt()
  }, [partnerOrderId]) // partnerOrderId가 변경되면 영수증 정보 다시 불러오기

  if (!orderDetails.length) {
    return <div>로딩 중...</div> // 데이터 로딩 중 표시
  }

  return (
    <div>
      <h1>Receipt for Order ID: {partnerOrderId}</h1>
      {orderDetails.map((detail, index) => (
        <div key={index}>
          <h2>Product: {detail.productName}</h2>
          <p>Price: ${detail.productPrice.toFixed(2)}</p>
          <p>Quantity: {detail.quantity}</p>
          <div>Store: {detail.storeName}</div>
          <div>Address: {detail.storeAddress}</div>
          <div>Phone: {detail.storePhone}</div>
          <div>Business Number: {detail.businessNumber}</div>
        </div>
      ))}
    </div>
  )
}

export default Receipt
