'use client'

import '../globals.css'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchExtended, apiUrl } from '../../utils/fetchExtended'

// date picker (mui)
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextField } from '@mui/material'
import dayjs from 'dayjs'

const Sales = () => {
  const [orders, setOrders] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
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
  }, [currentDate]) // currentDate가 변경될 때마다 fetchOrders 함수를 다시 실행한다.

  const formatDateYMD = (date, format = 'yyyy-mm-dd') => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = `0${d.getMonth() + 1}`.slice(-2) // 1월부터 시작 (+1), 8은 앞에 0을 붙여서 08, 10은 010이지만, slice를 통해 10으로 처리
    const day = `0${d.getDate()}`.slice(-2)
    return format === 'yyyy-mm' ? `${year}-${month}` : `${year}-${month}-${day}`
  }

  // Helper 함수들
  const formatDateYM = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = `0${d.getMonth() + 1}`.slice(-2)
    return `${year}-${month}`
  }

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 세자리마다 , 표시 추가
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="p-4 font-sbaggrol sm:ml-48">
      <h1 className="mb-4 pb-8 font-sbaggrom text-2xl">월별 주문내역</h1>
      {/* <div className="mb-6 flex items-center"> */}
      <div className="mb-6 flex items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year', 'month']}
            label="년과 월을 선택하세요"
            minDate={dayjs('2020-01')}
            maxDate={dayjs('2030-12')}
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </LocalizationProvider>
        <button onClick={handlePreviousMonth}>&lt;</button>
        <span> {formatDateYM(currentDate)} </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      <span className="ml-auto mr-0">당월 판매액: {formatNumber(totalSales)}원</span>

      <div className="relative overflow-x-auto">
        <table className="table-sm w-full text-left text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-100 text-xl uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="rounded-s-lg px-6 py-3">
                N o
              </th>
              <th scope="col" className="px-6 py-3">
                일 자
              </th>
              <th scope="col" className="px-6 py-3">
                품 목
              </th>
              <th scope="col" className="rounded-e-lg px-6 py-3">
                총 액
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{formatDateYMD(order.customerOrder.orderedAt)}</td>
                <td className="px-6 py-4">
                  {order.customerOrderProducts.map((product) => product.productName).join(', ')}
                </td>
                <td className="text-center">{formatNumber(order.customerOrder.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default Sales
