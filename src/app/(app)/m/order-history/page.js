'use client'

import React, { useState, useEffect, forwardRef, Fragment } from 'react'
import Link from 'next/link'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // 기본 스타일
import { Button } from 'flowbite-react'
import { IoIosArrowBack } from 'react-icons/io'
import ReceiptModal from '@/components/ReceiptModal'
import Loading from '@/components/ui/Loading'
import { useRouter } from 'next/navigation'

// 커스텀 입력 컴포넌트
// eslint-disable-next-line react/display-name
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="datepicker-button rounded-lg border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50"
  >
    {/* <CalendarIcon className="calendar-icon" /> */}
    {value}
  </button>
))

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSales, setTotalSales] = useState(0)
  // const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  // const [openDetails, setOpenDetails] = useState(null)
  const [viewType, setViewType] = useState(1) // 1: 판매, 2: 환불

  const [showReceipt, setShowReceipt] = useState(false)
  const [activeOrderId, setActiveOrderId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true) // 데이터 로딩 시작
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
      const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`
      const params = {
        // userCustomerId: 20, // 예시 사용자 ID
        monthYear: formattedDate,
        status: viewType, // 상태 추가
      }

      // 요청할 URL의 queryString 생성
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/api/order/history?${queryString}`

      try {
        const response = await fetchExtended(endpoint, {
          method: 'GET', // HTTP 요청 메서드 지정
          // credentials: 'include', // 인증 정보(쿠키, 인증 헤더 등) 포함 옵션
        })

        // 응답을 json 형태로 파싱
        const responseData = await response.json()
        if (!responseData) throw new Error('데이터 로딩 실패')

        // 상태 업데이트
        setOrders(responseData || [])

        // 총 판매액 계산
        const total = responseData.reduce((acc, order) => acc + order.customerOrder.totalAmount, 0)
        setTotalSales(total)
      } catch (error) {
        console.error('주문 내역을 불러오는 중 오류가 발생했습니다.', error)
        setOrders([])
        setTotalSales(0)
      } finally {
        setIsLoading(false) // 데이터 로딩 종료
      }
    }

    fetchOrders()
  }, [selectedDate, viewType, selectedDate]) // currentDate가 변경될 때마다 fetchOrders 함수를 다시 실행한다.

  // 추가된 부분: 판매내역 조회와 환불내역 조회를 위한 버튼 핸들러
  const handleViewTypeChange = (type) => {
    setViewType(type)
  }

  // 추가된 부분: 영수증 모달창
  const handleReceiptOpen = (orderId) => {
    setActiveOrderId(orderId)
    setShowReceipt(true)
  }

  const formatDateYMD = (date) => {
    // date가 문자열인 경우 Date 객체로 변환
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error('formatDateYMD called with invalid date')
      return '' // 혹은 적절한 기본값 반환
    }
    return dateObj.toLocaleDateString('ko-KR')
  }

  // // Helper 함수들
  // const formatDateYM = (date) => {
  //   const d = new Date(date)
  //   const year = d.getFullYear()
  //   const month = `0${d.getMonth() + 1}`.slice(-2)
  //   return `${year}-${month}`
  // }

  const formatNumber = (number) => {
    if (!number) return '0'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 세자리마다 , 표시 추가
  }

  // const handlePreviousMonth = () => {
  //   setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  // }

  // const handleNextMonth = () => {
  //   setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  // }

  const router = useRouter()

  return (
    <div className="flex h-screen flex-col bg-gray-100 p-2">
      {isLoading && <Loading />}
      <div className="fixed left-0 top-0 z-10 flex w-full items-center justify-between bg-white p-2 shadow-md">
        <button type="button" className="mb-4 flex items-center" onClick={() => router.push('/m')}>
          <IoIosArrowBack className="mr-2" />
          <h2 className="text-xl font-bold">구매목록</h2>
        </button>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM"
          showMonthYearPicker
          customInput={<CustomInput />}
          className="ml-4"
        />
      </div>

      <div className="mb-4 mt-20 flex w-full justify-center">
        <Button onClick={() => setViewType(1)} color={viewType === 1 ? 'gray' : 'white'}>
          구매내역 조회
        </Button>
        <Button onClick={() => setViewType(2)} color={viewType === 2 ? 'gray' : 'white'}>
          환불내역 조회
        </Button>
      </div>

      <div className="overflow-auto">
        {orders.map((order, index) => (
          <Fragment key={index}>
            <div className="mb-4 rounded-lg border-2 bg-white p-4 dark:bg-gray-800">
              <div>
                <div className="flex justify-between">
                  <span>
                    {formatDateYMD(order.customerOrder.orderedAt)}
                    <button
                      onClick={() => handleReceiptOpen(order.customerOrder.partnerOrderId)}
                      className="text-blue-500 hover:underline"
                    >
                      [{order.customerOrder.partnerOrderId}]
                    </button>
                  </span>
                  <span className="text-right text-lg font-bold">
                    {formatNumber(order.customerOrder.totalAmount)}
                  </span>
                </div>
                <div>
                  <div className="mt-2 text-gray-600">
                    {`${order.customerOrderProducts[0].productName} 외 ${order.customerOrderProducts.length - 1}개`}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      {showReceipt && (
        <ReceiptModal partnerOrderId={activeOrderId} onClose={() => setShowReceipt(false)} />
      )}
    </div>
  )
}

export default OrderHistory
