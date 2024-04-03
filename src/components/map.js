'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const MapComponent = ({ defaultPosition, stores }) => {
  const mapRef = useRef(null)
  const router = useRouter()
  const iconRef = '<div><img src="mapicon.png" width="30" height="30" alt="현재 위치"/></div>'

  useEffect(() => {
    const loadMap = async () => {
      if (!defaultPosition || !window.naver || !stores || stores.length === 0) return

      if (!mapRef.current) {
        const mapOptions = {
          center: new window.naver.maps.LatLng(defaultPosition.latitude, defaultPosition.longitude),
          zoom: 14,
        }
        mapRef.current = new window.naver.maps.Map('map', mapOptions)
      }

      stores.forEach((store) => {
        const markerPosition = new window.naver.maps.LatLng(store.wgs84Y, store.wgs84X)
        const marker = new window.naver.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
          icon: {
            content: iconRef,
            anchor: new window.naver.maps.Point(12, 30),
          },
        })

        // 정보창 내용 생성
        const contentString = `
            <div class="p-3 text-sext-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              <h3 class="text-1xl font-bold dark:text-white">${store.name}</h3>
            <div onclick="window.updateBookmark(${store.id})" style="cursor: pointer;">Bookmark</div>
            <button onClick="goInventory(${store.id})">재고현황</button>
              <br />
              </form>
              <form class="max-w-sm mx-auto">
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 top-0 flex items-center ps-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                          <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                      </svg>
                  </div>
                  <p aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^\d{5}(-\d{4})?$">${store.address}</p>
                </div>
              </form>
              <form class="max-w-sm mx-auto">
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 top-0 flex items-center ps-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
                          <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
                      </svg>
                  </div>
                  <p aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">${store.phone}</p>
                </div>
              </form>
            </div>`

        const infowindow = new window.naver.maps.InfoWindow({
          content: contentString,
        })

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (infowindow.getMap()) {
            infowindow.close()
          } else {
            infowindow.open(mapRef.current, marker)
          }
        })
      })
    }

    const script = document.createElement('script')
    script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=5vhz6jovug'
    script.async = true
    script.onload = loadMap
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [defaultPosition, stores])

  useEffect(() => {
    window.updateBookmark = async (storeId) => {
      try {
        const response = await fetchExtended(`/api/store/bookmark/update/${storeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          console.log('북마크 업데이트 성공')
        } else {
          console.error('북마크 업데이트 실패')
        }
      } catch (error) {
        console.error('북마크 업데이트 중 오류 발생:', error)
      }
    }

    window.goInventory = (storeId) => {
      router.push(`/map/inventory/${storeId}`)
    }

    return () => {
      delete window.updateBookmark
      delete window.goInventory
    }
  }, [router])

  return (
    <div>
      <div id="map" style={{ width: '100vw', height: '92vh' }}></div>
      {/* <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
       <div id="map" style={{ flex: '1', minWidth: '40%' }}></div> */}
    </div>
  )
}

export default MapComponent
