'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination, Table, Button } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Manager() {
  const router = useRouter()
  const [pagination, setPagination] = useState({
    paginationParam: {
      page: 1,
    },
    totalPageCount: 0,
    startPage: 0,
    endPage: 0,
    existPrev: false,
    existNext: false,
  })
  const [storeOrder, setStoreOrder] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStoreOrder = async (page = 1) => {
    setError(null)
    setIsLoading(true)

    const storeOrderReqUrl = new URL(apiUrl + `/api/manage/order?page=${page}`)

    await fetchExtended(storeOrderReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          console.log(res)
          throw new Error(res['message'])
        } else {
          setStoreOrder(res['data'])
          console.log(res['data'])
          setPagination(res['pagination'])
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleStoreOrder()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page: page + 1 },
    })
    handleStoreOrder(page)
  }

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>

  const orderDetailClick = (storeOrderId) => {
    router.push(`manager/detail/${storeOrderId}`)
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-10">
      <div className="flex flex-col items-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <Table className="text-s w-[calc(100vw-300px)] items-center justify-center text-center">
              <Table.Head className="text-m whitespace-nowrap text-gray-900 dark:text-white">
                <Table.HeadCell>id</Table.HeadCell>
                <Table.HeadCell>name</Table.HeadCell>
                <Table.HeadCell>items</Table.HeadCell>
                <Table.HeadCell>orderedAt</Table.HeadCell>
                <Table.HeadCell>state</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {storeOrder.map((item) => (
                  <Table.Row
                    key={item.id}
                    className="items-center bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell
                      onClick={() => orderDetailClick(item['id'])}
                      className="cursor-pointer hover:underline"
                    >
                      {item.orderItems}
                    </Table.Cell>
                    <Table.Cell>{item.orderedAt.split('T')[0]}</Table.Cell>
                    <Table.Cell>{item.state}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="relative flex items-center justify-center pt-10">
              <Pagination
                currentPage={pagination.paginationParam.page}
                totalPages={pagination.totalPageCount}
                showIcons={true}
                onPageChange={(page) => handlePage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
