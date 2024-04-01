'use client'

import '../../globals.css'
import React, { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { fetchExtended, apiUrl } from '../../../utils/fetchExtended'
// import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { HiOutlineTag } from 'react-icons/hi'
import { TbCalendarSmile } from 'react-icons/tb'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // 기본 스타일
import { Button } from 'flowbite-react'

const Payment = () => {
  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSales, setTotalSales] = useState(0)
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  const [openDetails, setOpenDetails] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
      const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`
      const params = {
        // userCustomerId: 20, // 예시 사용자 ID
        monthYear: formattedDate,
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
        setOrders(responseData)

        // 총 판매액 계산
        const total = responseData.reduce((acc, order) => acc + order.customerOrder.totalAmount, 0)
        setTotalSales(total)
      } catch (error) {
        console.error('주문 내역을 불러오는 중 오류가 발생했습니다.', error)
      }
    }

    fetchOrders()
  }, [selectedDate]) // currentDate가 변경될 때마다 fetchOrders 함수를 다시 실행한다.

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
    <div className="item-center flex flex-col  justify-center p-4 font-sbaggrol sm:ml-48">
      <div className="relative w-full max-w-4xl">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">판매내역 조회</h1>
          <button onClick={() => setDatePickerOpen(!isDatePickerOpen)} className="ml-2">
            <TbCalendarSmile size="30px" />
          </button>
        </div>
        {isDatePickerOpen && (
          <div className="absolute top-full mt-2">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM"
              showMonthYearPicker // 월과 년만 선택
              className="input font-sbaggrol" // TailwindCSS를 적용하기 위한 클래스
              inline
            />
          </div>
        )}
        {/* <p>선택된 날짜: {formatDateYMD(selectedDate)}</p> */}
      </div>

      {/* <button onClick={handlePreviousMonth}>&lt;</button>
      <span> {formatDateYM(currentDate)} </span>
      <button onClick={handleNextMonth}>&gt;</button> */}

      <table className="table-sm w-5/6 text-center text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="rounded-s-lg px-6 py-4">
              N o
            </th>
            <th scope="col" className="px-6 py-4">
              결 제 일 자
            </th>
            <th scope="col" className="px-6 py-4">
              상 품 정 보
            </th>
            <th scope="col" className="px-6 py-4">
              수 량
            </th>
            <th scope="col" className="px-6 py-4">
              가 격
            </th>
            <th scope="col" className="rounded-e-lg px-6 py-4">
              결 제 금 액
            </th>
          </tr>
        </thead>
        <tbody>
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
                  {/* 수정된 부분: URL 쿼리 스트링을 사용한 링크 */}
                  <Link
                    href={{
                      pathname: '/partnerOrder',
                      query: { partnerOrderId: order.customerOrder.partnerOrderId },
                    }}
                  >
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

      <div classname="mt-6 text-center">
        <Button
          onClick={() => (window.location.href = '/')}
          className="mb-2 me-2 rounded-lg border border-gray-200 bg-slate-200 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-zinc-200 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          HOME
        </Button>
      </div>
    </div>
  )
}

export default Payment
