'use client'

import Loading from '@/components/ui/Loading'
import { fetchExtended, apiUrl } from '@/utils/fetchExtended'
import { Button, Pagination, Table } from 'flowbite-react'
import { forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // 기본 스타일

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
  const [orderData, setOrderData] = useState({
    history: [],
    pagination: null,
  })
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewType, setViewType] = useState(1) // 1: 판매, 2: 환불
  const [isLoading, setIsLoading] = useState(true)

  async function getMonthlyOrderHistory(formmattedDate, viewType, page = 1, recordSize = 10) {
    const response = await fetchExtended(
      apiUrl +
        `/api/order/history?monthYear=${formmattedDate}&status=${viewType}&page=${page}&recordSize=${recordSize}`,
    )
    const responseData = await response.json()

    return responseData
  }

  useEffect(() => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
    const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`

    getMonthlyOrderHistory(formattedDate, viewType).then((responseData) => {
      setOrderData({
        history: responseData.history,
        pagination: responseData.pagination,
      })
      setIsLoading(false)
    })
  }, [viewType, selectedDate])

  const formatDateYMD = (date) => {
    // date가 문자열인 경우 Date 객체로 변환
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error('formatDateYMD called with invalid date')
      return '' // 혹은 적절한 기본값 반환
    }
    return dateObj.toLocaleDateString('ko-KR')
  }

  // 추가된 부분: 판매내역 조회와 환불내역 조회를 위한 버튼 핸들러
  const handleViewTypeChange = (type) => {
    setViewType(type)
  }

  const onPageChange = (page) => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1 // getMonth()는 0부터 시작하기 때문에 +1
    const formattedDate = `${year}-${month < 10 ? `0${month}` : month}`
    setIsLoading(true)
    getMonthlyOrderHistory(formattedDate, viewType, page).then((responseData) => {
      setOrderData({
        history: responseData.history,
        pagination: responseData.pagination,
      })
      setIsLoading(false)
    })
  }

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
            {orderData &&
              orderData.history.map((order, idx) => {
                const customerOrder = order['customerOrder']
                const customerOrderProducts = order['customerOrderProducts']
                return (
                  <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{customerOrder.id}</Table.Cell>
                    <Table.Cell>{formatDateYMD(customerOrder.orderedAt)}</Table.Cell>
                    <Table.Cell>
                      {customerOrderProducts && customerOrderProducts.length > 0
                        ? customerOrderProducts.length == 1
                          ? customerOrderProducts[0].productName
                          : `${customerOrderProducts[0].productName} 외 ${customerOrderProducts.length - 1}개`
                        : '상품 정보 없음'}
                    </Table.Cell>
                    <Table.Cell>{formatNumber(customerOrder.totalAmount)}</Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={orderData.pagination.paginationParam.page}
            totalPages={orderData.pagination.totalPageCount || 1}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Sales
