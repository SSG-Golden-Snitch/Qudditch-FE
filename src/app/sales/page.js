'use client'

import '../globals.css'
import React, { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { fetchExtended, apiUrl } from '../../utils/fetchExtended'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

// date picker (mui)
import { Button, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'

const Sales = () => {
  const [orders, setOrders] = useState([])
  // const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [totalSales, setTotalSales] = useState(0)
  const [openDetails, setOpenDetails] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const year = selectedDate.year()
      const month = selectedDate.month() + 1 // getMonth()는 0부터 시작하기 때문에 +1
      const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`
      const params = {
        userCustomerId: 5, // 예시 사용자 ID
        monthYear: formattedDate,
      }

      // 요청할 URL의 queryString 생성
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/api/order/history?${queryString}`

      try {
        const response = await fetchExtended(apiUrl + endpoint, {
          method: 'GET', // HTTP 요청 메서드 지정
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
    return dayjs(date).format('YYYY-MM-DD')
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
    <div className="p-4 font-sbaggrol sm:ml-48">
      <div className="mb-6 flex justify-between">
        <h1 className="font-sbaggrom text-2xl">월별 판매내역</h1>
        {/* <div className="mb-6 flex items-center"> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['month', 'year']}
            label="날짜를 선택하세요"
            minDate={dayjs('2020-01')}
            maxDate={dayjs('2030-12')}
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue)
              // 새로 선택된 날짜(newValue)를 사용하여 현재 날짜 상태(currentDate)를 업데이트합니다.
              setCurrentDate(new Date(newValue.$M, newValue.$Y))
            }}
            renderInput={(params) => <TextField {...params} helperText={null} size="small" />}
          />
        </LocalizationProvider>
        {/* <button onClick={handlePreviousMonth}>&lt;</button>
        <span> {formatDateYM(currentDate)} </span>
        <button onClick={handleNextMonth}>&gt;</button> */}
      </div>

      <table className="table-sm w-5/6 text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-center text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="rounded-s-lg px-6 py-4">
              N o
            </th>
            <th scope="col" className="px-6 py-4">
              일 자
            </th>
            <th scope="col" className="px-6 py-4">
              품 목
            </th>
            <th scope="col" className="px-6 py-4">
              수 량
            </th>
            <th scope="col" className="px-6 py-4">
              가 격
            </th>
            <th scope="col" className="rounded-e-lg px-6 py-4">
              총 액
            </th>
          </tr>
        </thead>
        <tbody className="text-left">
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
                <td className="px-6 py-4">{formatDateYMD(order.customerOrder.orderedAt)}</td>
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
                              <td className="flex items-center px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4">
                                {formatDateYMD(order.customerOrder.orderedAt)}
                              </td>
                              <td className="px-6 py-4">{product.productName}</td>
                              <td className="px-6 py-4">{product.qty}</td>
                              <td className="px-6 py-4">{formatNumber(product.price)}</td>
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
            <td colSpan="3" className="px-6 py-4 text-right">
              합계
            </td>
            <td className="px-6 py-4 text-right font-medium">{formatNumber(totalSales)}</td>
          </tr>
        </tbody>
      </table>

      <div classname="mt-6 text-center">
        <Button variant="outlined" href="/">
          HOME
        </Button>
      </div>
    </div>
  )
}

export default Sales
