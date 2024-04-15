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
  const [viewType, setViewType] = useState(1) // 1: 전체, 2: 무인매장

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

        // 거리순 정렬
        data.sort((a, b) => a.distance - b.distance)

        // viewType 1인 경우 바로 매장 목록을 설정
        if (viewType === 1) {
          setStores(data)
        } else {
          // viewType 2인 경우, 무인매장 필터링: userStoreId 유효성 확인
          await filterUnmannedStores(data)
        }
      } else {
        throw new Error('Failed to fetch store data')
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
      setMessage(error.message || 'Failed to fetch stores')
    }
  }

  const filterUnmannedStores = async (stores) => {
    const checks = await Promise.all(
      stores.map((store) =>
        fetchExtended(`/api/userstore?storeId=${store.id}`, { method: 'GET' }).then((res) =>
          res.ok ? res.json() : { userStoreId: null },
        ),
      ),
    )

    const validStores = stores.filter((store, index) => checks[index] && checks[index].userStoreId)
    setStores(validStores)
  }

  // 서비스 이용매장 (userStoreId 존재)
  const handleStoreSelect = async (storeId) => {
    const queryParams = new URLSearchParams({ storeId }).toString()
    const url = `/api/userstore?${queryParams}`

    const response = await fetchExtended(url, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()
      if (data.userStoreId) {
        setSelectedStore(data.userStoreId) // userStoreId로 selectedStore 상태 업데이트
        setMessage('매장이 성공적으로 선택되었습니다.')
      } else {
        setMessage('해당 매장은 무인매장 서비스를 제공하지 않습니다.')
      }
    } else {
      const error = await response.text() // 에러 메시지 읽기
      setMessage(`매장 선택에 실패하였습니다: ${error}`)
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
              className="mb-2 cursor-pointer rounded-md border border-gray-200 p-5 hover:bg-zinc-100"
              onClick={() => handleStoreSelect(store.id)} // 클릭 시 매장 선택 이벤트 처리
            >
              <Link href={`/m/store-select/camera/${store.id}`}>
                <p className="mb-2 font-bold">{store.id}</p>
                <div className="flex items-center justify-between">
                  <p className="mb-2 font-bold">{store.name}</p>
                  <p>
                    {distance !== '위치 정보 없음' ? `${distance}m` : 'Location info not available'}
                  </p>
                </div>
                <p>{store.address}</p>
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
