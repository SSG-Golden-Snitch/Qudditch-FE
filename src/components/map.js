'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useRef, useState } from 'react'
import { Table } from 'flowbite-react'

const MapComponent = ({ defaultPosition, stores }) => {
  const mapRef = useRef(null)
  const [bookmarks, setBookmarks] = useState([])
  const [inventoryVisible, setInventoryVisible] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState([])
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const iconRef = '<div><img src="mapicon.png" width="30" height="30" alt="현재 위치"/></div>'

  // 선택된 상점의 재고를 가져오는 함수
  const fetchInventory = async (storeId) => {
    try {
      const response = await fetchExtended(`/api/store/location/stock?userStoreId=${storeId}`)
      if (response.ok) {
        const { list } = await response.json()
        setSelectedInventory(list || [])
      } else {
        console.error('재고 데이터를 가져오는 데 실패했습니다.')
        setSelectedInventory([])
      }
    } catch (error) {
      console.error('재고 데이터를 가져오는 중 오류 발생:', error)
      setSelectedInventory([])
    }
  }

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const response = await fetchExtended('/api/store/bookmark')
        if (response.ok) {
          const { bookmarks } = await response.json() // 응답 구조가 { bookmarks: [...] } 형태라고 가정
          setBookmarks(bookmarks || []) // bookmarks가 undefined인 경우 빈 배열로 설정
        } else {
          console.error('북마크 데이터를 로드하는 데 실패했습니다.')
          setBookmarks([]) // 에러 발생 시 bookmarks를 빈 배열로 초기화
        }
      } catch (error) {
        console.error('북마크 데이터 로드 중 오류 발생:', error)
        setBookmarks([]) // 예외 처리 시 bookmarks를 빈 배열로 초기화
      }
    }

    loadBookmarks()
  }, [])

  useEffect(() => {
    const loadMap = async () => {
      if (!defaultPosition || !window.naver || !stores || stores.length === 0) return

      const mapOptions = {
        center: new window.naver.maps.LatLng(defaultPosition.latitude, defaultPosition.longitude),
        zoom: 14,
      }
      mapRef.current = new window.naver.maps.Map('map', mapOptions)

      stores.forEach((store) => {
        const isBookmarked = bookmarks.some((bookmark) => bookmark.storeId === store.id)

        const markerPosition = new window.naver.maps.LatLng(store.wgs84Y, store.wgs84X)
        const marker = new window.naver.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
          icon: {
            content: iconRef,
            anchor: new window.naver.maps.Point(12, 30),
          },
          //animation: window.naver.maps.Animation.BOUNCE,
        })

        const heartIcon = isBookmarked ? '❤️' : '🖤'

        // 정보창 내용 생성
        const contentString = `
            <div class="p-3 text-sext-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              <h3 class="text-1xl font-bold dark:text-white">${store.name}</h3>
            <div onclick="window.toggleBookmark(${store.id})">${heartIcon}</div>
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
            if (selectedStoreId === store.id) {
              setSelectedStoreId(null) // 선택된 상점이 현재 클릭한 마커의 상점이면 선택 해제
              setInventoryVisible(false) // 재고 섹션 숨기기
              setDrawerOpen(false) // 드로어 닫기
            } else {
              setSelectedStoreId(store.id) // 선택된 상점의 ID 설정
              setInventoryVisible(true) // 재고 섹션 표시
              fetchInventory(store.id) // 선택된 상점의 재고 가져오기
              setDrawerOpen(true)
            }
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
  }, [defaultPosition, stores, bookmarks])

  useEffect(() => {
    const toggleBookmark = async (storeId) => {
      try {
        const response = await fetchExtended(`/api/store/bookmark/toggle/${storeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          setBookmarks(response) // 북마크 상태 업데이트
        } else {
          console.error('북마크 토글에 실패했습니다.')
        }
      } catch (error) {
        console.error('북마크 토글 중 오류 발생:', error)
      }
    }

    // 함수를 전역 객체에 할당하여 외부에서 접근 가능하게 합니다.
    window.toggleBookmark = toggleBookmark

    return () => {
      // 컴포넌트가 언마운트될 때 window 객체에서 함수를 제거합니다.
      delete window.toggleBookmark
    }
  }, [defaultPosition, stores, bookmarks]) // `bookmarks` 상태가 변경될 때마다 useEffect 훅을 재실행

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div id="map" style={{ flex: '1', minWidth: '50%' }}></div>
      {drawerOpen && ( // 드로어 열린 상태에서만 표시
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            overflowY: 'auto',
          }}
        >
          {selectedInventory.length > 0 && (
            <div style={{ margin: '20px' }}>
              <Table>
                <Table.Head>
                  <td>Brand</td>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Quantity</td>
                </Table.Head>
                <Table.Body className="divide-y">
                  {selectedInventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.brand}</td>
                      <td>{item.productName}</td>
                      <td>{item.productPrice}원</td>
                      <td>{item.qty}개</td>
                    </tr>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default MapComponent
