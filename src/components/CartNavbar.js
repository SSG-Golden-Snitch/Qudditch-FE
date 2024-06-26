'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { Checkbox } from 'flowbite-react'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const CartNavbar = ({ allSelected, handleSelectAllChange, initiatePayment, totalPay }) => {
  const searchParams = useSearchParams()
  const pg_token = searchParams.get('pg_token')
  const router = useRouter()
  const [partnerOrderId, setPartnerOrderId] = useState(0)

  // 금액: 세 자리마다 , 표시
  const formatNumber = (number) => {
    if (!number) return '0'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 세자리마다 , 표시 추가
  }

  const handleInitiatePayment = async () => {
    // initiatePayment 함수 호출 결과를 paymentData에 저장
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

      setPartnerOrderId(data.partnerOrderId)

      if (response.ok) {
        console.log(data.partnerOrderId)
        // 결제 페이지로 리다이렉트
        window.open(data.redirectUrl, '_blank')
      } else {
        // 오류 처리
        console.error('Failed to initiate payment:', data)
      }
    } catch (error) {
      console.error('Error initiating payment:', error)
    }
  }

  // 결제요청에 대한 결과 (성공, 실패)
  useEffect(() => {
    const approvePayment = async () => {
      if (!pg_token) return

      try {
        const response = await fetchExtended('/api/payment/approve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pg_token,
            order_id: partnerOrderId,
          }),
        })

        const data = await response.json()

        // console.log(pg_token)

        // console.log(data)

        if (response.ok) {
          router.push('/m/store-select/payResult') // Navigate to success page
        } else {
          console.error('Failed to approve payment:', data)
          router.push('/m/store-select/cart') // Navigate to failure page
        }
      } catch (error) {
        console.error('Error approving payment:', error)
        router.push('/m/store-select/cart')
      }
    }

    approvePayment()
  }, [pg_token, router])

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 bg-gray-100 shadow-md">
      <div className="flex items-center justify-between rounded-t-2xl p-4">
        <div className="flex items-center">
          <Checkbox
            color={'warning'}
            id="allSelected"
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
            required
          />
          <span className="ml-2 font-medium">전체</span>
          <span className="ml-4 font-bold">총액: {formatNumber(totalPay)}원</span>
        </div>

        <button
          className="ml-4 flex-1 bg-amber-400 px-4 py-2 text-lg font-medium text-white"
          onClick={handleInitiatePayment}
        >
          결제하기
        </button>
      </div>
    </div>
  )
}

export default CartNavbar
