'use client'

import React, { useState } from 'react'

const Point = () => {
  // 가상의 사용 내역 데이터
  const transactionHistory = [
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: 100, date: '2024-04-01' },
    { type: '사용', amount: -50, date: '2024-04-02' },
    { type: '사용', amount: -30, date: '2024-04-03' },
    { type: '적립', amount: -30, date: '2024-04-03' },
  ]

  const [displayType, setDisplayType] = useState('전체')
  const [showAll, setShowAll] = useState(false)

  // 전체, 적립, 사용 버튼 클릭 핸들러
  const handleDisplayTypeChange = (type) => {
    setDisplayType(type)
    setShowAll(false) // 타입 변경 시 더보기 상태 초기화
  }

  // 더보기 버튼 클릭 핸들러
  const handleShowMore = () => {
    setShowAll(true)
  }

  // 출력할 사용 내역
  let filteredTransactions
  if (displayType === '전체') {
    filteredTransactions = showAll ? transactionHistory : transactionHistory.slice(0, 10)
  } else {
    filteredTransactions = showAll
      ? transactionHistory.filter((transaction) => transaction.type === displayType)
      : transactionHistory.filter((transaction) => transaction.type === displayType).slice(0, 10)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="fixed left-0 top-0 z-10 flex w-full justify-between bg-white p-4 shadow-md">
        <div>
          <h1 className="text-2xl font-bold">SSGmart포인트 확인</h1>
          <div className="mb-4">
            <p className="text-gray-600">보유 포인트:</p>
            <p className="text-gray-600">총 적립 포인트:</p>
            <p className="text-gray-600">총 사용 포인트:</p>
          </div>
        </div>
      </div>
      {/* 사용 내역 영역 */}
      <div className="px-4 pb-20 pt-20">
        <div className="mx-auto max-w-lg">
          <div className="fixed bottom-0 left-0 max-h-[calc(100vh-20rem)] w-full overflow-y-auto rounded-lg bg-white p-8 shadow-md">
            <div>
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
            {/* 더보기 버튼 */}
            {!showAll && (
              <button
                className="w-full rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
                onClick={handleShowMore}
              >
                더보기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Point
