'use client'

import '../../globals.css'
import React, { useState, useEffect, forwardRef, Fragment } from 'react'
import Link from 'next/link'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { HiOutlineTag } from 'react-icons/hi'
import { TbCalendarSmile } from 'react-icons/tb'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // 기본 스타일
import { Button } from 'flowbite-react'

// 커스텀 입력 컴포넌트
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button onClick={onClick} ref={ref} className="datepicker-button">
    {/* <CalendarIcon className="calendar-icon" /> */}
    {value}
  </button>
))

const Sales = () => {
  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSales, setTotalSales] = useState(0)
  // const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  const [openDetails, setOpenDetails] = useState(null)
  const [viewType, setViewType] = useState(1) // 1: 판매, 2: 환불

  useEffect(() => {
    const fetchOrders = async () => {
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
        const response = await fetchExtended(apiUrl + endpoint, {
          method: 'GET', // HTTP 요청 메서드 지정
          // credentials: 'include', // 인증 정보(쿠키, 인증 헤더 등) 포함 옵션
        })

        // 응답을 json 형태로 파싱
        const responseData = await response.json()
        if (!responseData) throw new Error('데이터 로딩 실패')

        // 상태 업데이트
        setOrders(responseData.orders || [])

        // 총 판매액 계산
        const total = responseData.reduce((acc, order) => acc + order.customerOrder.totalAmount, 0)
        setTotalSales(total)
      } catch (error) {
        console.error('주문 내역을 불러오는 중 오류가 발생했습니다.', error)
      }
    }

    fetchOrders()
  }, [selectedDate, viewType]) // currentDate가 변경될 때마다 fetchOrders 함수를 다시 실행한다.

  // 추가된 부분: 판매내역 조회와 환불내역 조회를 위한 버튼 핸들러
  const handleViewTypeChange = (type) => {
    setViewType(type)
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

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        <div className="flex items-center">
          <h1 className="mb-4 text-3xl font-bold">판매</h1>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            customInput={<CustomInput />}
          />
        </div>
      </div>

      {/* <button onClick={handlePreviousMonth}>&lt;</button>
      <span> {formatDateYM(currentDate)} </span>
      <button onClick={handleNextMonth}>&gt;</button> */}

      <div className="mb-4 flex w-full justify-center">
        <Button onClick={() => setViewType(1)} color={viewType === 1 ? 'gray' : 'white'}>
          판매내역 조회
        </Button>
        <Button onClick={() => setViewType(2)} color={viewType === 2 ? 'gray' : 'white'}>
          환불내역 조회
        </Button>
      </div>

      <table className="w-full max-w-4xl divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {['No', '결제 일자', '상품 정보', '수량', '가격', '결제 금액'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {orders.map((order, index) => (
            <Fragment key={index}>
              <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="flex items-center px-6 py-4">
                  <button
                    onClick={() => setOpenDetails(openDetails === index ? null : index)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {openDetails === index ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                  {index + 1}
                </td>
                {/* <td className="px-6 py-4">{index + 1}</td> */}
                <td className="px-6 py-4">
                  <div>{formatDateYMD(order.customerOrder.orderedAt)}</div>

                  <Link href={`/sales/receipt/${order.customerOrder.partnerOrderId}`}>
                    [{order.customerOrder.partnerOrderId}]
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {order.customerOrderProducts && order.customerOrderProducts.length > 0
                    ? `${order.customerOrderProducts[0].productName} 외 ${order.customerOrderProducts.length - 1}개`
                    : '상품 정보 없음'}
                </td>
                <td className="px-6 py-4">{order.customerOrderProducts.qty}</td>
                <td className="px-6 py-4">{order.customerOrderProducts.price}</td>
                <td className="px-6 text-right">{formatNumber(order.customerOrder.totalAmount)}</td>
              </tr>
              {openDetails === index && (
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan="6" className="px-6 py-4">
                    <table className="w-full">
                      <tbody>
                        {order.customerOrderProducts.map((product, prodIndex) => {
                          // 주문 상품의 총액 계산
                          const productTotalAmount = product.qty * product.price
                          return (
                            <tr key={prodIndex} className="border-b">
                              <td className="flex items-center px-6 py-4">
                                <HiOutlineTag />
                              </td>
                              <td className="px-6 py-4">
                                {formatDateYMD(order.customerOrder.orderedAt)}
                              </td>
                              <td className="px-6 py-4 text-left">{product.productName}</td>
                              <td className="px-6 py-4 text-right">{product.qty}</td>
                              <td className="px-6 py-4 text-right">
                                {formatNumber(product.price)}
                              </td>
                              <td className="px-6 text-right">
                                {formatNumber(productTotalAmount)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          <tr className="bg-gray-50 dark:bg-gray-700">
            <td colSpan="5" className="px-6 py-4 text-right">
              합계
            </td>
            <td className="px-6 py-4 text-right font-medium">{formatNumber(totalSales)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Sales
