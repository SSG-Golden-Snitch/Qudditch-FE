'use client'

import MapComponent from '@/components/map'
import { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const CurrentLocationComponent = () => {
  return <div></div>
}

const HomePage = () => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const onSuccessGeolocation = (position) => {
      const pos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      setCurrentPosition(pos)
      fetchLocationData(pos) // 백엔드에 위치 데이터 요청
    }

    const onErrorGeolocation = () => {
      console.error('Geolocation 실패')
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation)
    } else {
      console.error('Geolocation not supported')
    }
  }, [])

  const fetchLocationData = async ({ latitude, longitude }) => {
    try {
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

  return (
    <div>
      <MapComponent defaultPosition={currentPosition} stores={data} />
      <CurrentLocationComponent currentPosition={currentPosition} />
    </div>
  )
}

export default HomePage
