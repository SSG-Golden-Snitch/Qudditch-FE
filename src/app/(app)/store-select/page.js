'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended' // fetchExtended 함수의 정확한 경로를 확인하세요.

const StoreSelectPage = () => {
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState({ x: null, y: null })
  const [selectedStore, setSelectedStore] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          x: position.coords.longitude, // 경도
          y: position.coords.latitude, // 위도
        })
      })
    }
  }, [])

  useEffect(() => {
    if (currentLocation.x && currentLocation.y) {
      fetchStores()
    }
  }, [currentLocation])

  const params = {
    currentWgs84X: currentLocation.x,
    currentWgs84Y: currentLocation.y,
    limit: 5,
  }

  const fetchStores = async () => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/api/store/location?${queryString}`

    const response = await fetchExtended(endpoint, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()
      setStores(data)
    } else {
      setMessage('매장 목록을 불러오는 데 실패하였습니다.')
    }
  }

  const handleStoreSelect = async (storeId) => {
    const queryParams = new URLSearchParams({ storeId }).toString()
    const url = `/api/userstore?${queryParams}`

    const response = await fetchExtended(url, {
      method: 'GET',
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
