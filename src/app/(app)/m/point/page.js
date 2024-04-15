'use client'

import React, { useState, useEffect } from 'react'
import MobileNavbar from '@/components/MobileNavbar'
import { fetchExtended } from '@/utils/fetchExtended'
import { IoIosArrowBack } from 'react-icons/io'

const Point = () => {
  const [pointData, setPointData] = useState([])
  const [displayType, setDisplayType] = useState('전체')
  const [totalUsedPoint, setTotalUsedPoint] = useState(0)
  const [totalEarnPoint, setTotalEarnPoint] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [fetchingData, setFetchingData] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [showAllData, setShowAllData] = useState(false)
  const [showMoreButton, setShowMoreButton] = useState(true)

  useEffect(() => {
    if (!dataLoaded) {
      fetchPointData()
      setDataLoaded(true)
    }
  }, [dataLoaded])

  const fetchPointData = async () => {
    try {
      setFetchingData(true)
      const response = await fetchExtended(`api/order/history/point?startIndex=${startIndex}`)
      const data = await response.json()
      setFetchingData(false)

      data.sort((a, b) => new Date(a.orderedAt) - new Date(b.orderedAt))

      let totalUsed = 0
      let totalEarn = 0

      data.forEach((item) => {
        if (item.usedPoint) totalUsed += item.usedPoint
        if (item.earnPoint) totalEarn += item.earnPoint
      })

      setTotalUsedPoint(totalUsed)
      setTotalEarnPoint(totalEarn)

      setPointData(data)
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleDisplayTypeChange = (type) => {
    setDisplayType(type)
  }

  const handleLoadMore = () => {
    setShowAllData(true)
    setShowMoreButton(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  const renderTransactionHistory = () => {
    let filteredData = pointData.slice(0, showAllData ? pointData.length : 6)

    if (displayType === '전체') {
      filteredData = filteredData.filter((item) => item.usedPoint !== 0 || item.earnPoint !== 0)
    } else if (displayType === '사용') {
      filteredData = filteredData.filter((item) => item.usedPoint !== 0 && item.usedPoint !== null)
    } else if (displayType === '적립') {
      filteredData = filteredData.filter((item) => item.earnPoint !== 0 && item.earnPoint !== null)
    }

    return (
      <div className="mb-4">
        {' '}
        {/* Added mb-4 class */}
        <ul style={{ marginBottom: '100px' }}>
          {filteredData.map((item, index) => (
            <li
              key={index}
              className="mb-2"
              style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.8rem', color: '#888888' }}>
                    {formatDate(item.orderedAt)}
                  </p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {displayType === '전체' && item.usedPoint !== null && item.usedPoint !== 0 && (
                    <p style={{ color: 'red', fontSize: '1.2rem' }}>- {item.usedPoint}</p>
                  )}
                  {displayType === '전체' && item.earnPoint !== null && item.earnPoint !== 0 && (
                    <p style={{ color: 'green', fontSize: '1.2rem' }}>+ {item.earnPoint}</p>
                  )}
                  {displayType === '사용' && item.usedPoint !== null && item.usedPoint !== 0 && (
                    <p style={{ color: 'red', fontSize: '1.2rem' }}>
                      <br /> - {item.usedPoint}
                    </p>
                  )}
                  {displayType === '적립' && item.earnPoint !== null && item.earnPoint !== 0 && (
                    <p style={{ color: 'green', fontSize: '1.2rem' }}>
                      <br /> + {item.earnPoint}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      <div className="container mx-auto px-4 py-8">
        <div>
          <button
            type="button"
            className="mb-4 flex items-center"
            onClick={() => window.history.back()}
          >
            <IoIosArrowBack className="mr-2" />
            <h2 className="text-xl font-bold">포인트</h2>
          </button>
          <div className="mb-6 text-center">
            <p className="text-3xl font-bold">{totalEarnPoint - totalUsedPoint} P</p>
          </div>
        </div>
        <div className="mb-4 text-center">
          <button
            className="mr-3 rounded-md border bg-gray-100 px-4 py-2 text-black hover:bg-gray-300"
            onClick={() => handleDisplayTypeChange('전체')}
          >
            전체
          </button>
          <button
            className="mr-3 rounded-md border bg-gray-100 px-4 py-2 text-black hover:bg-gray-300"
            onClick={() => handleDisplayTypeChange('사용')}
          >
            사용
          </button>
          <button
            className="rounded-md border bg-gray-100 px-4 py-2 text-black hover:bg-gray-300"
            onClick={() => handleDisplayTypeChange('적립')}
          >
            적립
          </button>
        </div>
        {renderTransactionHistory()}
        {showMoreButton && !showAllData && (
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
