'use client'

import '../globals.css'
import styles from './Sales.module.css'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

const Sales = () => {
  const [orders, setOrders] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const fetchOrders = async () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
      const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`
      try {
        const response = await axios.get(`http://localhost:8080/api/order/history`, {
          params: {
            userCustomerId: 5, // 예시 사용자 ID
            monthYear: formattedDate,
          },
        })
        setOrders(response.data)
      } catch (error) {
        console.error('주문 내역을 불러오는 중 오류가 발생했습니다.', error)
      }
    }

    fetchOrders()
  }, [currentDate])

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
    <div className={`${styles.cartMainSection} p-4 sm:ml-48`}>
      <h1 className="mb-4 text-xl font-bold">월별 주문 내역</h1>
      <div className={`${styles.hiddenFrame}`}>
        <button onClick={handlePreviousMonth}>&lt;</button>
        <span> {formatDate(currentDate)} </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>일자</th>
            <th>품목</th>
            <th>총액</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{formatDate(order.customerOrder.orderedAt)}</td>
              <td>
                {order.customerOrderProducts.map((product) => product.productName).join(', ')}
              </td>
              <td>{order.customerOrder.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default Sales
