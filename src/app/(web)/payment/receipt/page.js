'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router' // Next.js에서 제공하는 useRouter 훅
import { apiUrl } from '../../../../utils/fetchExtended'

const Receipt = () => {
  const [receipt, setReceipt] = useState(null)
  const router = useRouter()
  const { partnerOrderId } = router.query // router.query의 기본값 설정은 필요 없음

  useEffect(() => {
    const fetchData = async () => {
      // partnerOrderId가 있을 때만 실행
      if (partnerOrderId) {
        const endpoint = `/api/order/${partnerOrderId}` // URL 경로에 partnerOrderId 포함
        try {
          const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'GET',
          })

          const responseData = await response.json()
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`)
          }
          setReceipt(responseData)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }

    if (router.isReady) {
      fetchData()
    }
  }, [partnerOrderId, router.isReady]) // 의존성 배열에 router.isReady 추가

  if (!receipt) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>영수증</h1>
      <div>Order ID: {receipt?.customerOrder?.partnerOrderId}</div>
      <div>Date: {receipt?.customerOrder?.orderedAt}</div>
      <div>Total Amount: {receipt?.customerOrder?.totalAmount}</div>
      <ul>
        {receipt?.customerOrderProducts?.map((product, index) => (
          <li key={index}>
            {product.name} - {product.price} x {product.qty}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Receipt
