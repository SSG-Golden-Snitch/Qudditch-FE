'use client'

import '../globals.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

const Sales = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 백엔드 서비스로부터 월별 주문 내역을 불러옵니다.
        const { data } = await axios.get(`http://localhost:8080/api/order/history`, {
          params: {
            userCustomerId: 5,
            monthYear: '2024-03',
          },
        })
        setOrders(data) // 상태 업데이트
      } catch (error) {
        console.error('월별 주문 내역을 불러오는 중 에러가 발생했습니다.', error)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="p-4 sm:ml-48">
      <h1 className="mb-4 text-xl font-bold">월별 주문내역</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <p>
              주문 번호: {order.customerOrder.id}, 주문 날짜:{' '}
              {new Date(order.customerOrder.orderedAt).toLocaleDateString()}
            </p>
            <ul>
              {order.customerOrderProducts.map((product, idx) => (
                <li key={idx}>
                  상품 ID: {product.productId}, 수량: {product.qty}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default Sales
