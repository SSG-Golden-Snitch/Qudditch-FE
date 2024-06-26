'use client'

import MapComponent from '@/components/map'
import { Suspense, useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import CustomLoading from '@/components/ui/CustomLoading'
import { CheckLogin } from '@/utils/user'

const HomePage = () => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchLocationData = async ({ latitude, longitude }) => {
      try {
        console.log(`Fetching location data from ${latitude} to ${longitude}`)
        const limit = 30
        const response = await fetchExtended(
          `/api/store/location?currentWgs84X=${longitude}&currentWgs84Y=${latitude}&limit=${limit}`,
        )
        if (!response.ok) {
          throw new Error('데이터를 불러오지 못했습니다')
        }
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error(error)
      }
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      setCurrentPosition(pos)
      fetchLocationData(pos) // 백엔드에 위치 데이터 요청
    })
  }, [])

  return (
    <Suspense fallback={<CustomLoading />}>
      <div>
        <MapComponent defaultPosition={currentPosition} stores={data} />
      </div>
    </Suspense>
  )
}

export default HomePage
