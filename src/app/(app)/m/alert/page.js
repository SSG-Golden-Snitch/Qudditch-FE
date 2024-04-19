'use client'

import CustomLoading from '@/components/ui/CustomLoading'
import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'

import { IoIosArrowBack } from 'react-icons/io'
import { CheckLogin } from '@/utils/user'
import { useRouter } from 'next/navigation'

export default function AlertListPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = useState()
  const [message, setMessage] = useState()

  CheckLogin()

  useEffect(() => {
    fetchNotification()
  }, [])

  // 디바이스 정보 조회 API
  const fetchNotification = async () => {
    const endpoint = `/api/fcm/alerts`

    try {
      const response = await fetchExtended(endpoint, {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setIsLoading(false)
        setAlerts(data)

        data.forEach((alert) => {
          if (alert.readedAt == null) {
            // 디바이스 정보 조회 API
            const setAlertReadedAt = async (readId) => {
              const endpoint = `/api/fcm/alert/readed-at`
              let currentDateTime = getCurrentDateTime()

              try {
                const response = await fetchExtended(endpoint, {
                  method: 'POST',
                  body: JSON.stringify({
                    alertId: readId,
                    readedAt: currentDateTime,
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })

                if (response.ok) {
                  // SUCCESS
                  alertLog.readedAt = readedAt
                } else {
                  throw new Error('푸시 알림 정보를 가져오는데 실패했습니다.')
                }
              } catch (error) {
                console.log(error.message)
              }
            }

            setAlertReadedAt(alert.id)
          }
        })
      } else {
        throw new Error('푸시 알림 정보를 가져오는데 실패했습니다.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-full bg-gray-100 px-3 pb-3">
      <div className="py-4">
        <button type="button" className="flex items-center" onClick={() => router.push('/m')}>
          <IoIosArrowBack className="mr-2" />
          <h2 className="text-m font-semibold">알림 기록</h2>
        </button>
      </div>
      <ul className="rounded-2xl bg-white shadow">
        {isLoading ? <CustomLoading /> : message ? message : <AlertList list={alerts} />}
      </ul>
    </div>
  )
}

function AlertList({ list }) {
  const [renderEffect, setRender] = useState(false)

  const renderList = list.map((alertLog, i) => {
    return (
      <li key={i} id={alertLog.id}>
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="max-w-60 text-lg font-medium leading-6 text-gray-900">
              {alertLog.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {toAlertDate(alertLog.createdAt)}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="max-w-80 text-sm font-medium text-gray-500">{alertLog.body}</p>
            <RiCloseLine
              color="gray"
              size={'20px'}
              onClick={() => {
                let deleteId = alertLog.id

                const deleteAlert = async () => {
                  const endpoint = `/api/fcm/alert`

                  try {
                    const response = await fetchExtended(endpoint, {
                      method: 'DELETE',
                      body: JSON.stringify({
                        alertId: deleteId,
                      }),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })

                    if (response.ok) {
                      // SUCCESS
                      const idx = list.findIndex(function (item) {
                        return item.id === deleteId
                      }) // findIndex = find + indexOf
                      // 리스트에서 해당 객체 삭제
                      if (idx > -1) list.splice(idx, 1)

                      setRender(!renderEffect)
                    } else {
                      throw new Error('푸시 알림 정보를 삭제하는데 실패했습니다.')
                    }
                  } catch (error) {
                    alert(error.message)
                  }
                }

                deleteAlert()
              }}
              className="ml-2 text-3xl text-gray-700"
            />
          </div>
        </div>
      </li>
    )
  })

  return <div>{renderList}</div>
}

// 2023-04-04 14:40:43 => 그외는 2023년 4월 4일
// 2024-04-04 14:40:43 => 올해는 4월 4일
function toAlertDate(dateString) {
  // 문자열을 공백을 기준으로 분리하여 배열로 만듭니다.
  const parts = dateString.split(' ')

  // 첫 번째 요소는 날짜이므로 다시 -를 기준으로 분리하여 년, 달, 일로 나눕니다.
  const dateParts = parts[0].split('-')

  const year = Number(dateParts[0]) // 년도
  const month = Number(dateParts[1]) // 달
  const day = Number(dateParts[2]) // 일

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  if (currentYear === year) {
    return `${month}월 ${day}일`
  } else {
    return `${year}년 ${month}월 ${day}일`
  }
}

function getCurrentDateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
