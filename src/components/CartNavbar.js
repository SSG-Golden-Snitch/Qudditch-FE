'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import React from 'react'

const CartNavbar = ({ allSelected, handleSelectAllChange, initiatePayment, totalPay }) => {
  const handleInitiatePayment = async () => {
    const paymentData = initiatePayment()

    try {
      const response = await fetchExtended('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요한 경우, 인증 토큰을 여기에 추가
        },
        body: JSON.stringify(paymentData),
      })
      const data = await response.json()
      if (response.ok) {
        // 결제 페이지로 리다이렉트
        window.location.href = data
      } else {
        // 오류 처리
        console.error('Failed to initiate payment:', data)
      }
    } catch (error) {
      console.error('Error initiating payment:', error)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 bg-gray-100 shadow-md">
      <div className="flex items-center justify-between rounded-t-2xl p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
            className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 font-medium">전체</span>
          <span className="ml-4 font-bold">총액: {totalPay}원</span>
        </div>

        <button
          className="ml-4 flex-1 bg-blue-500 px-4 py-2 text-lg font-medium text-white"
          onClick={handleInitiatePayment}
        >
          결제하기
        </button>
      </div>
    </div>
  )
}

export default CartNavbar