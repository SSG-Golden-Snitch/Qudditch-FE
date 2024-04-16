'use client'

import React, { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { IoMdClose } from 'react-icons/io'

const ReceiptModal = ({ partnerOrderId, onClose }) => {
  const [orderDetails, setOrderDetails] = useState([])

  useEffect(() => {
    async function fetchReceipt() {
      const endpoint = `/api/order/receipt?partnerOrderId=${partnerOrderId}`
      try {
        const response = await fetchExtended(endpoint)
        if (response.ok) {
          const data = await response.json()
          console.log('received data', data)
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

  const formatNumber = (number) => {
    if (!number) return '0'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 세자리마다 , 표시 추가
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
      <div className="relative w-full max-w-lg rounded-md bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="text-lg font-bold">전자영수증</h1>
          <button className="absolute right-3 top-3 text-xl" onClick={onClose}>
            <IoMdClose />
          </button>
        </div>
        <h1 className="my-4 text-center text-xl font-bold">주문번호 {partnerOrderId}</h1>
        <h3 className="mb-4 text-center text-xl font-bold">현금결제</h3>

        {orderDetails.map((detail, index) => (
          <div key={index} className="mb-4 rounded-lg bg-white p-4 shadow">
            <div className="flex justify-between">
              <p className="text-sm">매장 {detail.storeName}</p>
              <p className="text-sm">주소 {detail.storeAddress}</p>
            </div>
            <p className="text-sm">전화번호 {formatPhoneNumber(detail.storePhone)}</p>
            <p className="text-sm">사업자 번호 {formatBusinessNumber(detail.businessNumber)}</p>

            <hr className="my-2 border-dotted" />

            <div className="mb-2 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-base">{detail.productName}</h2>
              </div>
              <div className="flex items-center space-x-10">
                <p className="text-base">{formatNumber(detail.productPrice)}</p>
                <p className="text-base">{detail.qty}</p>
                <p className="text-base">{formatNumber(detail.productPrice * detail.qty)}</p>
              </div>
            </div>

            <hr className="my-2 border-dotted" />

            <div className="flex items-center justify-between">
              <p className="text-base">합계</p>
              <p className="text-base">{formatNumber(detail.productPrice * detail.qty)}</p>
            </div>

            <hr className="my-2 border-dotted" />

            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">결제금액</p>
              <p className="text-lg font-bold">{formatNumber(detail.productPrice * detail.qty)}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-base">(부가세포함)</p>
              <p className="text-sm font-bold">
                ({formatNumber(detail.productPrice * detail.qty * 0.1)})
              </p>
            </div>

            <hr className="my-2 border-dotted" />

            <p className="text-sm">주문번호 {partnerOrderId}</p>
            <p className="text-sm">결제수단 카카오페이</p>

            <hr className="my-2 border-dotted" />

            <div className="text-sm">
              <p>사용 포인트: {detail.usedPoint}</p>
              <p>적립 포인트: {detail.earnPoint}</p>
              {/* <p>포인트 잔액: {detail.earnPoint - detail.usedPoint}</p> */}
            </div>

            <hr className="my-2 border-dotted" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceiptModal
