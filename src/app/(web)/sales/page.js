'use client'

import React, { useState, useEffect, forwardRef, Fragment } from 'react'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // 기본 스타일
import { Button, Pagination, Table } from 'flowbite-react'
import Loading from '@/components/ui/Loading'

// 커스텀 입력 컴포넌트
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="datepicker-button border border-gray-300 bg-white p-2 font-bold text-gray-500 shadow-sm hover:bg-gray-50"
  >
    {value}
  </button>
))

// 빌드 에러 해결
// Component-definition-is-missing-display-name-에러
CustomInput.displayName = 'CustomInput'

const Sales = () => {
  const itemsPerPage = 10
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPageCount: 1, // 기본값 1로 설정하여 에러 방지
  })

  const [orders, setOrders] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalSales, setTotalSales] = useState(0)
  const [viewType, setViewType] = useState(1) // 1: 판매, 2: 환불
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
        const response = await fetchExtended(endpoint, {
          method: 'GET', // HTTP 요청 메서드 지정
          // credentials: 'include', // 인증 정보(쿠키, 인증 헤더 등) 포함 옵션
        })

        // 응답을 json 형태로 파싱
        const responseData = await response.json()
        if (!responseData) throw new Error('데이터 로딩 실패')

        // 상태 업데이트
        setOrders(responseData || [])
        setTotalSales(responseData.reduce((acc, order) => acc + order.customerOrder.totalAmount, 0))
        setPagination((prev) => ({
          ...prev,
          totalPageCount: Math.ceil(responseData.length / itemsPerPage),
        }))
      } catch (error) {
        console.error('주문 내역을 불러오는 중 오류가 발생했습니다.', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [selectedDate, viewType, pagination.currentPage])

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

  if (isLoading) return <Loading />

  const headers = [
    { label: 'No', key: 'index' },
    { label: 'Order Date', key: 'orderedAt' },
    { label: 'Product Details', key: 'productDetails' },
    { label: 'Total Amount', key: 'totalAmount' },
  ]

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start bg-[#e4e4e4] p-10">
      <div className="flex min-w-full items-center justify-between pb-3">
        <div className="flex items-center">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            customInput={<CustomInput />}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={() => handleViewTypeChange(1)} color={viewType === 1 ? 'gray' : 'light'}>
            판매내역 조회
          </Button>
          <Button onClick={() => handleViewTypeChange(2)} color={viewType === 2 ? 'gray' : 'light'}>
            환불내역 조회
          </Button>
        </div>
      </div>

      <div className="w-full">
        <Table striped={true} className="text-center">
          <Table.Head>
            {headers.map((header, index) => (
              <Table.HeadCell key={index}>{header.label}</Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y">
            {orders
              .slice(
                (pagination.currentPage - 1) * itemsPerPage,
                pagination.currentPage * itemsPerPage,
              )
              .map((order, index) => (
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{(pagination.currentPage - 1) * itemsPerPage + index + 1}</Table.Cell>
                  <Table.Cell>{formatDateYMD(order.customerOrder.orderedAt)}</Table.Cell>
                  <Table.Cell>
                    {order.customerOrderProducts && order.customerOrderProducts.length > 0
                      ? `${order.customerOrderProducts[0].productName} 외 ${order.customerOrderProducts.length - 1}개`
                      : '상품 정보 없음'}
                  </Table.Cell>
                  <Table.Cell>{formatNumber(order.customerOrder.totalAmount)}</Table.Cell>
                </Table.Row>
              ))}
            <Table.Row>
              <Table.Cell colSpan={3} className="text-right">
                Total Sales:
              </Table.Cell>
              <Table.Cell>{formatNumber(totalSales)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPageCount} // 수정: 올바른 totalPages 값 사용
            onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
          />
        </div>
      </div>
    </div>
  )
}

export default Sales
