'use client'

import React, { useState, useEffect } from 'react'
import MobileNavbar from '@/components/MobileNavbar'
import { fetchExtended } from '@/utils/fetchExtended'

const Point = () => {
  const [pointData, setPointData] = useState([])
  const [displayType, setDisplayType] = useState('전체')
  const [totalUsedPoint, setTotalUsedPoint] = useState(0)
  const [totalEarnPoint, setTotalEarnPoint] = useState(0)
  const [startIndex, setStartIndex] = useState(0) // 시작 인덱스 추가
  const [fetchingData, setFetchingData] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false) // 데이터를 한 번만 로드하도록 제어하는 상태
  const [showAllData, setShowAllData] = useState(false) // 전체 데이터를 보여줄지 여부를 제어하는 상태

  useEffect(() => {
    if (!dataLoaded) {
      fetchPointData()
      setDataLoaded(true) // 데이터 로드 상태 업데이트
    }
  }, [dataLoaded]) // dataLoaded 상태가 변경될 때마다 데이터 로드

  const fetchPointData = async () => {
    try {
      setFetchingData(true)
      const response = await fetchExtended(`api/order/history/point?startIndex=${startIndex}`)
      const data = await response.json()
      setFetchingData(false)

      // 날짜 순으로 정렬
      data.sort((a, b) => new Date(a.orderedAt) - new Date(b.orderedAt))

      let totalUsed = 0
      let totalEarn = 0

      data.forEach((item) => {
        if (item.usedPoint) totalUsed += item.usedPoint
        if (item.earnPoint) totalEarn += item.earnPoint
      })

      setTotalUsedPoint(totalUsed)
      setTotalEarnPoint(totalEarn)

      // 새로운 데이터를 설정
      setPointData(data)
    } catch (error) {
      console.error('error', error)
    }
  }

  // 전체, 사용, 적립 버튼 클릭 핸들러
  const handleDisplayTypeChange = (type) => {
    setDisplayType(type)
  }

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setShowAllData(true) // 전체 데이터 표시 상태 업데이트
  }

  // 사용 내역 렌더링 함수
  const renderTransactionHistory = () => {
    // 선택된 표시 타입에 따라 데이터 필터링
    let filteredData = []
    if (displayType === '전체') {
      filteredData = pointData.filter((item) => item.usedPoint !== 0 || item.earnPoint !== 0)
    } else if (displayType === '사용') {
      filteredData = pointData.filter((item) => item.usedPoint !== 0 && item.usedPoint !== null)
    } else if (displayType === '적립') {
      filteredData = pointData.filter((item) => item.earnPoint !== 0 && item.earnPoint !== null)
    }

    // 전체 데이터를 보여줄지 여부에 따라 출력
    if (showAllData) {
      return (
        <ul style={{ marginBottom: '100px' }}>
          {filteredData.map((item, index) => (
            <li key={index} className="mb-2">
              <p>주문일: {item.orderedAt}</p>
              {(displayType === '전체' || displayType === '사용') && item.usedPoint !== null && (
                <p>사용 포인트: {item.usedPoint}</p>
              )}
              {(displayType === '전체' || displayType === '적립') && item.earnPoint !== null && (
                <p>적립 포인트: {item.earnPoint}</p>
              )}
            </li>
          ))}
        </ul>
      )
    } else {
      // 6개까지만 출력
      return (
        <ul>
          {filteredData.slice(0, 6).map((item, index) => (
            <li key={index} className="mb-2">
              <p>주문일: {item.orderedAt}</p>
              {(displayType === '전체' || displayType === '사용') && item.usedPoint !== null && (
                <p>사용 포인트: {item.usedPoint}</p>
              )}
              {(displayType === '전체' || displayType === '적립') && item.earnPoint !== null && (
                <p>적립 포인트: {item.earnPoint}</p>
              )}
            </li>
          ))}
        </ul>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileNavbar />
      <div className="container mx-auto px-4 py-8">
        <div>
          <h1 className="mb-2 text-2xl font-bold">SSGmart포인트 확인</h1>
          <div className="mb-2">
            <p className="text-gray-600">총 포인트: {totalEarnPoint - totalUsedPoint}</p>
            <p className="text-gray-600">총 적립 포인트: {totalEarnPoint}</p>
            <p className="text-gray-600">총 사용 포인트: {totalUsedPoint}</p>
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold">포인트 사용 내역</h2>
        {/* 버튼 영역 */}
        <div className="mb-2">
          <button
            className="mr-2 rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
            onClick={() => handleDisplayTypeChange('전체')}
          >
            전체
          </button>
          <button
            className="mr-2 rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
            onClick={() => handleDisplayTypeChange('사용')}
          >
            사용
          </button>
          <button
            className="rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
            onClick={() => handleDisplayTypeChange('적립')}
          >
            적립
          </button>
        </div>
        {/* 사용 내역 출력 */}
        {renderTransactionHistory()}
        {/* 더보기 버튼 */}
        {!showAllData && (
          <button
            className="w-full rounded-md border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
            onClick={handleLoadMore}
          >
            더보기
          </button>
        )}
      </div>
    </div>
  )
}

export default Point
