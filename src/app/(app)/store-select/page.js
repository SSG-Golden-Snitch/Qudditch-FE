'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { Await } from 'react-router-dom'

const StoreSelectPage = () => {
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState({ x: null, y: null })
  const [selectedStore, setSelectedStore] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 사용자 위치가 설정 -> 가까운 매장 목록
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          x: position.coords.latitude,
          y: position.coords.longitude,
        })
      })
    }
  }, [])

  useEffect(() => {
    if (currentLocation.x && currentLocation.y) {
      fetchStores()
    }
  }, [currentLocation])

  const fetchStores = async () => {
    const response = await fetchExtended('/api/store/location', {
      method: 'GET',
      params: {
        currentWgs84X: currentLocation.x,
        currentWgs84Y: currentLocation.y,
        limit: 5,
      },
    })
    if (response.ok) {
      const data = await response.json()
      setStores(data)
    }
  }

  const handleStoreSelect = async (storeId) => {
    const response = await fetchExtended('/api/userstore', {
      method: 'GET',
      params: {
        storeId: storeId,
      },
    })
    if (response.ok) {
      const data = await response.text()
      setMessage('매장이 성공적으로 선택되었습니다. ' + data)
      setSelectedStore(storeId)
    } else {
      setMessage('매장 선택에 실패하였습니다.')
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">매장 선택</h1>
      {message && <div className="mb-4 rounded bg-blue-100 p-3 text-blue-800">{message}</div>}
      <div>
        {stores.map((store) => (
          <div
            key={store.id}
            className="mb-2 cursor-pointer rounded-md border border-gray-200 p-2"
            onClick={() => handleStoreSelect(store.id)}
          >
            <p className="font-medium">{store.name}</p>
            <p>{store.address}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreSelectPage
