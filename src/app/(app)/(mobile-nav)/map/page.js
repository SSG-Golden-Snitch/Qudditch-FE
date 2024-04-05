'use client'

import MapComponent from '@/components/map'
import { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

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
    const onErrorGeolocation = () => {
      console.error('Geolocation 실패')
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
    <div>
      <MapComponent defaultPosition={currentPosition} stores={data} />
    </div>
  )
}

export default HomePage
