'use client'
import { Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import OrderList from '@/components/storeOrder'
import { Pagination } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { fetchExtended } from '@/utils/fetchExtended'
import CustomLoading from '@/components/ui/CustomLoading'

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

  if (isLoading) return <CustomLoading />
  if (!orderData.pagination) return <div>데이터를 불러오지 못했습니다.</div>

  return (
    <div className="h-screen overflow-x-auto bg-[#e4e4e4] px-10 pb-10 pt-[6rem] ">
      <Table className="text-center font-semibold text-black">
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
      <a
        onClick={handleInsertClick}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 p-3 px-4 py-2 font-medium text-gray-600 shadow-md transition duration-300 ease-out"
      >
        <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-gray-500 text-white duration-300 group-hover:translate-x-0">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </span>
        <span className="ease absolute flex h-full w-full transform items-center justify-center transition-all duration-300 group-hover:translate-x-full">
          발주등록
        </span>
        <span className="invisible relative">발주등록</span>
      </a>
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
