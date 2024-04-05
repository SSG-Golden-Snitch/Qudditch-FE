'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'

const Receipt = ({ params }) => {
  // const pathname = usePathname();
  // const [searchParams, setSearchParams] = useSearchParams()
  // const partnerOrderId = searchParams.get('partnerOrderId')
  const [receiptData, setReceiptData] = useState(null)
  console.log(params.partnerOrderId)

  useEffect(() => {
    if (!params.partnerOrderId) return

    async function fetchData() {
      const endpoint = `/api/order/receipt?partnerOrderId=${params}` // 쿼리 스트링 직접 포함
      try {
        // fetchExtended 사용 시 baseUrl과 headers가 자동으로 처리됨
        const response = await fetchExtended(endpoint, {
          method: 'GET',
        })

        // fetchExtended로부터 반환된 response는 이미 JSON 형태라고 가정
        if (!response.ok) throw new Error('데이터 로딩 실패')
        setReceiptData(await response.json())
      } catch (error) {
        console.error('Error fetching receipt data:', error)
      }
    }

    fetchData()
  }, [])

  if (!receiptData) {
    return <div>로딩 중...</div>
  }

  return (
    <div>
      <h1>Receipt for Order ID: {params.partnerOrderId}</h1>
      <div>Date: {receiptData.customerOrder.orderedAt}</div>
      <div>Total Amount: {receiptData.customerOrder.totalAmount}</div>
    </div>
  )
}

export default Receipt
