'use client'

import React, { useState, useEffect } from 'react'
import MobileNavbar from '@/components/MobileNavbar'
import { fetchExtended } from '@/utils/fetchExtended'

const Point = () => {
  const [usedPoint, setUsedPoint] = useState(null)
  const [earnPoint, setEarnPoint] = useState(null)
  const [orderedAt, setOrderedAt] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [displayType, setDisplayType] = useState('전체')

  useEffect(() => {
    const fetchPointData = async () => {
      try {
        const response = await fetchExtended(`/order/history/point`)
        const data = await response.json()

        // 데이터를 orderedAt 기준으로 정렬
        data.sort((a, b) => new Date(a.orderedAt) - new Date(b.orderedAt))

        // 사용 포인트와 적립 포인트 계산
        const totalUsedPoint = data.reduce(
          (acc, curr) => acc + (curr.type === '사용' ? curr.amount : 0),
          0,
        )
        const totalEarnPoint = data.reduce(
          (acc, curr) => acc + (curr.type === '적립' ? curr.amount : 0),
          0,
        )

        setUsedPoint(totalUsedPoint)
        setEarnPoint(totalEarnPoint)
        setOrderedAt(data.map((item) => item.orderedAt))
        setTransactions(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    fetchPointData()
  }, [])

  useEffect(() => {
    // 필터링된 트랜잭션 설정
    if (displayType === '전체') {
      setFilteredTransactions(transactions)
    } else {
      const filtered = transactions.filter((transaction) => transaction.type === displayType)
      setFilteredTransactions(filtered)
    }
  }, [displayType, transactions])

  const handleDisplayTypeChange = (type) => {
    setDisplayType(type)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-full flex-col justify-between bg-white p-4 shadow-md">
        <div>
          <h1 className="text-2xl font-bold">SSGmart포인트 확인</h1>
          <div className="mb-4">
            <p className="text-gray-600">
              보유 포인트: {displayType === '사용' ? usedPoint : earnPoint}
            </p>
            <p className="text-gray-600">총 적립 포인트: {earnPoint}</p>
            <p className="text-gray-600">총 사용 포인트: {usedPoint}</p>
          </div>
        </div>
        {/* 버튼과 사용 내역 영역 */}
        <div className="w-full max-w-lg overflow-y-auto">
          <div className="mb-8">
            <button
              className="rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
              onClick={() => handleDisplayTypeChange('전체')}
            >
              전체
            </button>
            <button
              className="rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
              onClick={() => handleDisplayTypeChange('적립')}
            >
              적립
            </button>
            <button
              className="rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
              onClick={() => handleDisplayTypeChange('사용')}
            >
              사용
            </button>
          </div>
          {/* 사용 내역 컴포넌트 */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">포인트 사용내역</h2>
            <ul>
              {filteredTransactions.map((transaction, index) => (
                <li key={index} className="flex justify-between">
                  <p>{transaction.type}</p>
                  <p>{transaction.amount} P</p>
                  <p>{transaction.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <MobileNavbar />
      </div>
    </div>
  )
}

export default Point
