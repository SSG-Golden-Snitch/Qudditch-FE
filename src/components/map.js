'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from 'flowbite-react'
import { CustomAlert } from './CustomAlert'

const MapComponent = ({ defaultPosition, stores }) => {
  const [selectStore, setSelectStore] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const mapRef = useRef(null)
  const router = useRouter()
  const iconRef = '<div><img src="mapicon.png" width="30" height="30" alt="현재 위치"/></div>'

  const handleAlert = (message = '') => {
    setAlertMessage(message)
  }
  const handleMarkerClick = (store) => {
    console.log(store)
    setSelectStore(store)
    setOpenModal(true)
  }
  const handleBookMarkClick = (e) => {
    window.updateBookmark(selectStore.id)
    e.stopPropagation()
  }

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
        // 마커 클릭 이벤트 리스너 추가
        window.naver.maps.Event.addListener(marker, 'click', () => {
          handleMarkerClick(store)
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
  }, [defaultPosition, stores, handleMarkerClick])

  useEffect(() => {
    window.updateBookmark = async (storeId) => {
      try {
        const response = await fetchExtended(`/api/store/bookmark/update/${storeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          setAlertMessage('관심스토어 설정이 완료되었습니다')
          console.log('북마크 업데이트 성공')
        } else {
          console.error('북마크 업데이트 실패')
        }
      } catch (error) {
        console.error('북마크 업데이트 중 오류 발생:', error)
      }
    }

    window.goInventory = (storeId) => {
      if (!storeId) {
        setAlertMessage('스토어 정보가 없습니다.')
      } else {
        router.push(`/map/inventory/${storeId}`)
      }
    }

    return () => {
      delete window.updateBookmark
      delete window.goInventory
    }
  }, [router])

  return (
    <div>
      <div id="map" style={{ width: '100vw', height: '92vh' }}></div>
      {alertMessage && <CustomAlert message={alertMessage} handleDismiss={handleAlert} />}
      {selectStore && (
        <Modal show={selectStore !== null} onClose={() => setSelectStore(null)}>
          <div
            className="fixed inset-0 flex items-end justify-center  "
            onClick={() => setSelectStore(null)}
          >
            <div
              className="overflow-hidden bg-white shadow-xl "
              style={{
                width: '60%',
                maxWidth: '20rem',
                height: 'auto',
                transform: 'translateY(-30%)',
                borderRadius: '30px',
              }}
            >
              <Modal.Header>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <h3 className="text-xl font-bold dark:text-white" style={{ marginRight: '7px' }}>
                    {selectStore.name}
                  </h3>
                  <img
                    src="bookmark.png"
                    style={{ cursor: 'pointer', width: '26px', height: '26px' }}
                    onClick={handleBookMarkClick}
                  />
                </div>
              </Modal.Header>
              <Modal.Body>
                <div className="mx-auto max-w-sm space-y-4">
                  <div className="relative">
                    <svg
                      className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                    </svg>
                    <p className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400">
                      {selectStore.address}
                    </p>
                  </div>
                  <div className="relative">
                    <svg
                      className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 19 18"
                    >
                      <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                    </svg>
                    <p className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400">
                      {selectStore.phone}
                    </p>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <button
                    onClick={() => window.goInventory(selectStore.id)}
                    className="mx-auto mb-2 rounded-full border border-gray-300 bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  >
                    재고현황
                  </button>
                </div>
              </Modal.Body>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MapComponent
