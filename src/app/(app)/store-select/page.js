'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import MobileNavbar from '@/components/MobileNavbar'

const StoreSelectPage = () => {
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState({ x: null, y: null })
  const [selectedStore, setSelectedStore] = useState(null)
  const [message, setMessage] = useState('')
  const [viewType, setViewType] = useState(1) // 1: 전체, 2: CU, 3: GS25, 4: 세븐일레븐

  // 위치 받기 (navigator.geolocation)
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

  // useEffect(() => {
  //   if (currentLocation.x && currentLocation.y) {
  //     fetchStores()
  //   }
  // }, [currentLocation])

  const fetchStores = async () => {
    const params = {
      currentWgs84X: currentLocation.x,
      currentWgs84Y: currentLocation.y,
      limit: 10,
    }

    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/api/store/location?${queryString}`

    try {
      const response = await fetchExtended(endpoint, {
        method: 'GET',
      })
      if (response.ok) {
        const data = await response.json()
        // viewType 1인 경우 바로 매장 목록을 설정
        if (viewType === 1) {
          setStores(data)
        } else {
          // viewType 2, 3, 4인 경우, 필터링된 목록을 설정
          filterStoresByName(data)
        }
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  // 매장 이름 검색 반환
  const filterStoresByName = (allStores) => {
    const nameMap = { 2: 'CU', 3: 'GS25', 4: '세븐일레븐' }
    const filteredStores = allStores.filter((store) => store.name.includes(nameMap[viewType]))
    setStores(filteredStores)
  }

  useEffect(() => {
    fetchStores()
  }, [viewType, currentLocation])

  // 서비스 이용매장 (userStoreId 존재)
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
      <h1 className="mb-6 text-center text-2xl font-bold">매장 설정</h1>
      {message && <div className="mb-4 rounded bg-blue-100 p-3 text-blue-800">{message}</div>}

      <h3 className="mb-4 border-b-2">거리순</h3>

      <div className="mb-4 flex w-full justify-start">
        <Button onClick={() => setViewType(1)} color={viewType === 1 ? 'gray' : 'white'}>
          전체
        </Button>
        <Button onClick={() => setViewType(2)} color={viewType === 2 ? 'gray' : 'white'}>
          CU
        </Button>
        <Button onClick={() => setViewType(3)} color={viewType === 3 ? 'gray' : 'white'}>
          GS25
        </Button>
        <Button onClick={() => setViewType(4)} color={viewType === 4 ? 'gray' : 'white'}>
          세븐일레븐
        </Button>
      </div>

      <div>
        {stores.map((store) => (
          <div
            key={store.id}
            className="mb-2 cursor-pointer rounded-md border border-gray-200 p-5"
            onClick={() => handleStoreSelect(store.id)}
          >
            <Link href={`/store-select/camera`}>
              <p className="mb-2 font-bold">{store.name}</p>
              <p>{store.address}</p>
            </Link>
          </div>
        ))}
      </div>

      <MobileNavbar />
    </div>
  )
}

export default StoreSelectPage
