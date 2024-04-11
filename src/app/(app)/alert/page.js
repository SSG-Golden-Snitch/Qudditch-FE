'use client'

import Loading from '@/components/ui/Loaing'
import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { AiFillBell } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa'

import { Button, Modal } from 'flowbite-react'
import { IoIosArrowBack } from 'react-icons/io'

export default function AlertListPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [alerts, setAlerts] = useState()
  const [message, setMessage] = useState()

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
      } else {
        throw new Error('푸시 알림 정보를 가져오는데 실패했습니다.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="bg-gray-100 px-3 pb-3">
      <div className="p-3">
        <button
          type="button"
          className="mb-4 flex items-center"
          onClick={() => window.history.back()}
        >
          <IoIosArrowBack className="mr-2" />
          <div className="text-xl font-bold dark:text-white">알림 기록</div>
        </button>
      </div>
      <ul className="rounded-2xl bg-white shadow">
        {isLoading ? <Loading /> : message ? message : <AlertList list={alerts} />}
      </ul>
    </div>
  )
}

function AlertList({ list }) {
  const [modalAlertInfo, setModalAlertInfo] = useState()
  const [openModal, setOpenModal] = useState(false)

  const renderList = list.map((alertLog, i) => {
    return (
      <li
        key={alertLog.id}
        id={alertLog.id}
        onClick={async () => {
          await (async () => {
            let readId = alertLog.id
            let readedAt = getCurrentDateTime()

            if (alertLog.readedAt != null) {
              return
            }

            // 디바이스 정보 조회 API
            const setAlertReadedAt = async () => {
              const endpoint = `/api/fcm/alert/readed-at`

              try {
                const response = await fetchExtended(endpoint, {
                  method: 'POST',
                  body: JSON.stringify({
                    alertId: readId,
                    readedAt: readedAt,
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
                alert(error.message)
              }
            }
            await setAlertReadedAt()
          })()

          setModalAlertInfo(alertLog)
          setOpenModal(true)
        }}
      >
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
            {alertLog.readedAt == null ? (
              <AiFillBell className="ml-2 text-3xl text-gray-700" />
            ) : (
              <FaCheck className="ml-2 text-3xl text-gray-700" />
            )}
          </div>
        </div>
      </li>
    )
  })

  return (
    <>
      {renderList}
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <div className="flex justify-between">
            <div>{modalAlertInfo && modalAlertInfo.title}</div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500">
              {modalAlertInfo && modalAlertInfo.body}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpenModal(false)
            }}
          >
            확인
          </Button>
          <Button
            color="gray"
            onClick={async () => {
              await (async () => {
                let deleteId = modalAlertInfo.id

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
                    } else {
                      throw new Error('푸시 알림 정보를 가져오는데 실패했습니다.')
                    }
                  } catch (error) {
                    alert(error.message)
                  }
                }
                await deleteAlert()
              })()
              setOpenModal(false)
            }}
          >
            삭제
          </Button>
          <div
            className="flex-grow text-center text-xs font-bold leading-relaxed text-gray-800"
            style={{ fontSize: '0.65rem' }}
          >
            <div>createdAt : {modalAlertInfo && modalAlertInfo.createdAt}</div>
            <div>readedAt : {modalAlertInfo && modalAlertInfo.readedAt}</div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
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
