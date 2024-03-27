'use client'

import '../globals.css'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchExtended, apiUrl } from '../../utils/fetchExtended'

const Sales = () => {
  const [orders, setOrders] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const fetchOrders = async () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
      const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`
      const params = {
        userCustomerId: 5, // 예시 사용자 ID
        monthYear: formattedDate,
      }

      // 요청할 URL의 queryString 생성
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/api/order/history?${queryString}`

      try {
        const response = await fetchExtended(apiUrl + endpoint, {
          method: 'GET', // HTTP 요청 메서드 지정
        })

        // 응답을 json 형태로 파싱
        const responseData = await response.json()

        // 상태 업데이트
        setOrders(responseData)
      } catch (error) {
        console.error('주문 내역을 불러오는 중 오류가 발생했습니다.', error)
      }
    }

    fetchOrders()
  }, [currentDate]) // currentDate가 변경될 때마다 fetchOrders 함수를 다시 실행한다.

  const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = `0${d.getMonth() + 1}`.slice(-2) // getMonth()는 0부터 시작하기 때문에 +1
    const day = `0${d.getDate()}`.slice(-2)
    return `${year}-${month}-${day}`
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <div className="p-4 font-sbaggrol sm:ml-48">
      <h1 className="mb-4 pb-8 font-sbaggrom text-2xl">월별 주문내역</h1>
      <div className="mb-6 flex items-center">
        <button onClick={handlePreviousMonth}>&lt;</button>
        <span> {formatDate(currentDate)} </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <table className="w-full table-fixed border-separate border-spacing-3 rounded bg-stone-50">
        <thead>
          <tr
            className="h-20 w-16 overflow-hidden rounded bg-white"
            style={{ boxShadow: '0px 1px 13px 0 rgba(0,0,0,0.05)' }}
          >
            <th className="text-2xl">N o</th>
            <th className="text-2xl">일 자</th>
            <th className="text-2xl">품 목</th>
            <th className="text-2xl">총 액</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{formatDate(order.customerOrder.orderedAt)}</td>
              <td className="text-center">
                {order.customerOrderProducts.map((product) => product.productName).join(', ')}
              </td>
              <td className="text-center">{order.customerOrder.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default Sales
