'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import MobileNavbar from '@/components/MobileNavbar'
import { getDistance } from '@/utils/mapUtil'

const StoreSelectPage = () => {
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState({ x: null, y: null })
  const [selectedStore, setSelectedStore] = useState(null)
  const [message, setMessage] = useState('')
  const [viewType, setViewType] = useState(1) // 1: 전체, 2: CU, 3: GS25, 4: 세븐일레븐

  // 위치 받기 (navigator.geolocation)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('현재 위치:', position.coords.latitude, position.coords.longitude)
          setCurrentLocation({
            x: position.coords.longitude, // 경도
            y: position.coords.latitude, // 위도
          })
          fetchStores(position.coords.longitude, position.coords.latitude)
        },
        (error) => {
          console.error('위치정보 오류:', error)
        },
      )
    }
  }, [])

  useEffect(() => {
    if (currentLocation.x && currentLocation.y) {
      fetchStores(currentLocation.x, currentLocation.y)
    }
  }, [currentLocation, viewType])

  const fetchStores = async (longitude, latitude) => {
    console.log(`가게를 조회하는 현재 위치: ${latitude}, ${longitude}`)
    const params = {
      currentWgs84X: longitude,
      currentWgs84Y: latitude,
      limit: 5,
    }

    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/api/store/location?${queryString}`

    try {
      const response = await fetchExtended(endpoint, {
        method: 'GET',
      })
      if (response.ok) {
        let data = await response.json()

        // 거리 계산 및 추가
        data = data.map((store) => ({
          ...store,
          distance: getDistance(currentLocation.y, currentLocation.x, store.wgs84Y, store.wgs84X),
        }))

        // 거리순으로 정렬
        data.sort((a, b) => a.distance - b.distance)

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
    const nameMap = { 2: 'CU' }
    const filteredStores = allStores.filter((store) => store.name.includes(nameMap[viewType]))
    setStores(filteredStores)
  }

  // useEffect(() => {
  //   fetchStores()
  // }, [viewType, currentLocation])

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

      // selectedStore 업데이트
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
          무인매장
        </Button>
      </div>

      <div>
        {stores.map((store) => {
          console.log(store.id)
          const distance = getDistance(
            currentLocation.y,
            currentLocation.x,
            store.wgs84Y,
            store.wgs84X,
          )

          return (
            <div
              key={store.id} // 리스트 아이템 렌더링 할 때 고유한 식별자
              className="mb-2 cursor-pointer rounded-md border border-gray-200 p-5"
            >
              <Link href={`/m/store-select/camera/${store.id}`}>
                <p className="mb-2 font-bold">{store.id}</p>
                <p className="mb-2 font-bold">{store.name}</p>
                <p>{store.address}</p>
                <p>
                  {distance !== '위치 정보 없음' ? `${distance}m` : 'Location info not available'}
                </p>
              </Link>
            </div>
          )
        })}
      </div>
      <MobileNavbar />
    </div>
  )
}

export default StoreSelectPage
