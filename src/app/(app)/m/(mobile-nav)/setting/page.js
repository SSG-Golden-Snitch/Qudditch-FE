'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AiFillBell, AiFillSetting } from 'react-icons/ai'
import { LiaClipboardListSolid } from 'react-icons/lia'
import { FaBox } from 'react-icons/fa'
import { IoStorefront } from 'react-icons/io5'
import { FaMobileAlt } from 'react-icons/fa'
import { SlLocationPin } from 'react-icons/sl'
import Loading from '@/components/ui/Loading'

const WebSettingPage = () => {
  const [topMessage, setTopMessage] = useState()
  const [isTopLoading, setIsTopLoading] = useState(true)
  const [bookmarkStore, setBookmarkStore] = useState()
  const [name, setName] = useState()
  const [point, setPoint] = useState(0)
  const [totalUsedPoint, setTotalUsedPoint] = useState(0)
  const [totalEarnPoint, setTotalEarnPoint] = useState(0)
  const [startIndex, setStartIndex] = useState(0) // 시작 인덱스 추가

  useState(async () => {
    async function getBookmarkStore() {
      const endpoint = `/api/store/bookmark`

      try {
        const response = await fetchExtended(endpoint, {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()

          if (data.length > 0) {
            setBookmarkStore(data[0].name)
          }
        } else {
          throw new Error('푸시 알림 정보를 가져오는데 실패했습니다.')
        }
      } catch (error) {
        setTopMessage(error.message)
        setIsTopLoading(false)
      }
    }

    function getUsername() {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('token')
        const base64Payload = token.split('.')[1]
        const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
        const decodedJWT = JSON.parse(
          decodeURIComponent(
            window
              .atob(base64)
              .split('')
              .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
              })
              .join(''),
          ),
        )

        setName(decodedJWT.name)
      }
    }

    async function getPoint() {
      // point 가져오기
      try {
        const response = await fetchExtended(`api/order/history/point?startIndex=${startIndex}`)
        const data = await response.json()

        // 날짜 순으로 정렬
        data.sort((a, b) => new Date(a.orderedAt) - new Date(b.orderedAt))

        let totalUsed = 0
        let totalEarn = 0

        data.forEach((item) => {
          if (item.usedPoint) totalUsed += item.usedPoint
          if (item.earnPoint) totalEarn += item.earnPoint
        })

        setTotalUsedPoint(totalUsed)
        setTotalEarnPoint(totalEarn)

        // 새로운 데이터를 설정
        setPoint(totalEarn - totalUsed)
        setIsTopLoading(false)
      } catch (error) {
        setTopMessage(error.message)
        setIsTopLoading(false)
      }
    }

    await getBookmarkStore()
    getUsername()
    await getPoint()
  }, [])

  return (
    <>
      {isTopLoading ? (
        <Loading />
      ) : topMessage != null ? (
        topMessage
      ) : (
        <div className="mx-3 mt-3 h-48 rounded-3xl bg-gray-200 p-8">
          <div className="flex">
            <SlLocationPin className="ml-2 text-sm text-gray-700" />
            <div className="ml-3 text-sm">{bookmarkStore}</div>
          </div>
          <div className="ml-2 mt-2 text-2xl font-bold">{name}님, 반가워요!</div>
          <div className="mx-2 mt-3 rounded-lg bg-gray-100">
            <Link className="block w-full p-4" href="/m/point">
              <div className="text-center text-2xl font-semibold">{point + 'P'}</div>
            </Link>
          </div>
        </div>
      )}
      <div className="flex justify-between border-b-2 border-gray-200">
        {/* TODO 회원정보 수정 url*/}
        <Link className="block w-full p-6" href="/m/update">
          <div className="flex">
            <AiFillSetting className="ml-2 text-3xl text-gray-700" />
            <div className="ms-3 text-lg font-medium text-gray-900">회원정보 수정</div>
          </div>
        </Link>
      </div>
      <Toggle />
      <div className="flex justify-between border-b-2 border-gray-200">
        <Link className="block w-full p-6" href="/m/alert">
          <div className="flex">
            <LiaClipboardListSolid className="ml-2 text-3xl text-gray-700" />
            <div className="ms-3 text-lg font-medium text-gray-900">알림목록 조회</div>
          </div>
        </Link>
      </div>
      <div className="flex justify-between border-b-2 border-gray-200">
        <Link className=" block w-full p-6" href="/m/bookmark/product">
          <div className="flex">
            <FaBox className="ml-2 text-3xl text-gray-700" />
            <div className="ms-3 text-lg font-medium text-gray-900">관심상품 관리</div>
          </div>
        </Link>
      </div>
      <div className="flex justify-between border-b-2 border-gray-200">
        <Link className=" block w-full p-6" href="/m/customer-service">
          <div className="flex">
            <IoStorefront className="ml-2 text-3xl text-gray-700" />
            <div className="ms-3 text-lg font-medium text-gray-900">고객센터</div>
          </div>
        </Link>
      </div>
      <div className="flex justify-between border-b-2 border-gray-200">
        <Link className=" block w-full p-6" href="/m/app-info">
          <div className="flex">
            <FaMobileAlt className="ml-2 text-3xl text-gray-700" />
            <div className="ms-3 text-lg font-medium text-gray-900">앱 정보</div>
          </div>
        </Link>
      </div>
    </>
  )
}
export default WebSettingPage

function Toggle() {
  const [message, setMessage] = useState()
  const [deviceInfo, setDeviceInfo] = useState()
  const [isChecked, setIsChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotification()

    if (Notification.permission !== 'granted') {
      // 알림이 이미 허용된 상태
      const pushPermissionMsg = '기기에서 직접 알림을 허용해주세요'
      setMessage(pushPermissionMsg)
    }
  }, [])

  // 디바이스 정보 조회 API
  const fetchNotification = async () => {
    const endpoint = `/api/fcm/customer-device`

    try {
      const response = await fetchExtended(endpoint, {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setDeviceInfo(data)
        setIsChecked(data.state)
        setIsLoading(false)
      } else {
        throw new Error('푸시 알림 정보를 가져오는데 실패했습니다.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  // 디바이스 정보 조회 API
  const fetchSetNotification = async (active) => {
    try {
      const response = await fetchExtended(`/api/fcm/notification?active=${active}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const responseData = await response.text()
        // console.log(responseData) // SUCCESS
      } else {
        throw new Error('푸시 알림을 설정하는데 실패했습니다.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="flex justify-between border-b-2 border-gray-200  p-6">
      <div className="flex">
        <AiFillBell className="ml-2 text-3xl text-gray-700 dark:text-gray-200" />
        <span className="ms-3 text-lg font-medium text-gray-900">푸시 알림</span>
      </div>
      {isLoading ? (
        <MiniLoading />
      ) : message != null ? (
        message
      ) : (
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            className="peer sr-only"
            onChange={(e) => {
              setIsChecked(e.target.checked)
              fetchSetNotification(e.target.checked)
            }}
            checked={isChecked}
          />
          <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
        </label>
      )}
    </div>
  )
}

function MiniLoading() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function getNameFromToken() {
  if (typeof window !== 'undefined') {
    // JWT 토큰 가져오기
    const token = sessionStorage.getItem('token') // 세션 스토리지에서 토큰을 가져옵니다.
    const base64Payload = token.split('.')[1]
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedJWT = JSON.parse(
      decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(''),
      ),
    )

    return decodedJWT
  }
}
