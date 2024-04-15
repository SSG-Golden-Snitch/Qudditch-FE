'use client'
import { Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import OrderList from '@/components/storeOrder'
import { Pagination } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { fetchExtended } from '@/utils/fetchExtended'
import Loading from '@/components/ui/Loading'

async function getorderList(page = 1, recordSize = 10) {
  const response = await fetchExtended(`/api/store/order?page=${page}&recordSize=${recordSize}`)
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

  if (isLoading) return <Loading />
  if (!orderData.pagination) return <div>데이터를 불러오지 못했습니다.</div>

  return (
    <div className="h-screen overflow-x-auto bg-gray-100 px-10 py-10">
      <Table>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>State</Table.HeadCell>
          <Table.HeadCell>Ordered At</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {orderData.orderList.map((order) => (
            <OrderList
              key={order.id}
              id={order.id}
              state={order.state}
              orderedAt={order.orderedAt}
            />
          ))}
        </Table.Body>
      </Table>
      <br />
      <button
        className="rounded border border-gray-400 bg-white px-5 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100"
        onClick={handleInsertClick}
      >
        발주등록
      </button>
      <div className="relative flex items-center justify-center pt-10">
        <Pagination
          currentPage={orderData.pagination.paginationParam.page}
          totalPages={orderData.pagination.totalPageCount || 1}
          onPageChange={handlePage}
        />
      </div>
    </div>
  )
}
