'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Next.js 14에서 변경된 임포트 경로

const PartnerOrder = () => {
  const [receipt, setReceipt] = useState(null)
  const router = useRouter()
  const { partnerOrderId } = router.query || {} // router.query가 준비되지 않았을 경우를 대비한 기본값 설정

  useEffect(() => {
    const fetchData = async () => {
      if (router.isReady && partnerOrderId) {
        try {
          const response = await fetch(`/api/order/${partnerOrderId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`)
          }
          const data = await response.json()
          setReceipt(data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()
  }, [router.isReady, partnerOrderId])

  if (!receipt) {
    return <div>Loading...</div> // 데이터 로딩 중 표시
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

export default PartnerOrder
