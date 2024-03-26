'use client'
import React, { useEffect, useState } from 'react'
import OrderList from '@/components/storeOrder'
import { Pagination } from 'flowbite-react'
import { useRouter } from 'next/navigation'

const URL = 'http://localhost:8080/api/store/order'

async function getorderList(page = 1, recordSize = 10) {
  const response = await fetch(`${URL}?page=${page}&recordSize=${recordSize}`)
  const data = await response.json()
  return data
}

export default function OrderListPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState({
    orderList: [],
    pagination: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getorderList().then((data) => {
      setOrderData({
        orderList: data.orderList,
        pagination: data.pagination,
      })
      setIsLoading(false)
    })
  }, [])

  const handlePage = (page) => {
    setIsLoading(true)
    getorderList(page).then((data) => {
      setOrderData({
        orderList: data.orderList,
        pagination: data.pagination,
      })
      setIsLoading(false)
    })
  }

  const handleInsertClick = () => {
    router.push('order/insert')
  }

  if (isLoading) return <div>Loading...</div>
  if (!orderData.pagination) return <div>No pagination data</div>

  return (
    <div className="flex flex-col bg-gray-100 py-16">
      <table className="table-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>State</th>
            <th>Ordered At</th>
          </tr>
        </thead>
        <tbody>
          {orderData.orderList.map((order) => (
            <OrderList
              key={order.id}
              id={order.id}
              state={order.state}
              orderedAt={order.orderedAt}
            />
          ))}
        </tbody>
      </table>
      <div className="items-center justify-center">
        <Pagination
          currentPage={orderData.pagination.paginationParam.page}
          totalPages={orderData.pagination.totalPageCount || 1}
          onPageChange={handlePage}
        />
      </div>
      <button
        className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100"
        onClick={handleInsertClick}
      >
        발주등록
      </button>
    </div>
  )
}
