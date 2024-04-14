'use client'

import React, { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const ReceiptModal = ({ partnerOrderId, onClose }) => {
  const [orderDetails, setOrderDetails] = useState([])

  useEffect(() => {
    async function fetchReceipt() {
      const endpoint = `/api/order/receipt?partnerOrderId=${partnerOrderId}`
      try {
        const response = await fetchExtended(endpoint)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        } else {
          throw new Error('영수증 정보를 불러오는 데 실패했습니다.')
        }
      } catch (error) {
        console.error('영수증 정보를 불러오는 중 오류 발생:', error)
      }
    }

    fetchReceipt()
  }, [partnerOrderId])

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  }

  const formatBusinessNumber = (number) => {
    return number.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-center text-xl font-bold">Order ID: {partnerOrderId} 영수증</h1>
        {orderDetails.map((detail, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-lg font-semibold">제품: {detail.productName}</h2>
            <p>가격: ${detail.productPrice.toFixed(2)}</p>
            <p>수량: {detail.quantity}</p>
            <p>매장: {detail.storeName}</p>
            <p>주소: {detail.storeAddress}</p>
            <p>전화번호: {formatPhoneNumber(detail.storePhone)}</p>
            <p>사업자 번호: {formatBusinessNumber(detail.businessNumber)}</p>
          </div>
        ))}
        <button
          onClick={onClose}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default ReceiptModal
