'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'
import { Pagination } from 'flowbite-react'

export default function Stock() {
  const [pagination, setPagination] = useState({
    paginationParam: {
      page: 1,
      recordSize: 10,
    },
    totalPageCount: 0,
    startPage: 0,
    endPage: 0,
    existPrev: false,
    existNext: false,
  })
  const [storeStock, setStoreStock] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStoreStock = async (page = 1, recordSize = 10) => {
    setIsLoading(true)

    const storeStockReqUrl = new URL(
      `http://localhost:8080/api/store/stock?page=${page}&recordSize=${recordSize}`,
    )

    // storeStockReqUrl.searchParams.append('categoryId', 1)

    await fetch(storeStockReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setStoreStock(res['data'])
        setPagination(res['pagination'])
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleStoreStock()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page: page + 1 },
    })
    handleStoreStock(page)
  }

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div> // 로딩 중 화면

  if (error) return <div>Error: {error}</div>

  return (
    <div className="felx grid h-screen flex-col bg-gray-100 py-16">
      <div>
        <h1 className="text-center text-2xl font-bold">category</h1>
      </div>
      <div className="flex flex-col items-center">
        <CustomTable
          data={storeStock}
          pagination={pagination}
          header={[
            { label: 'category', col_name: 'categoryName' },
            { label: 'brand', col_name: 'brand' },
            { label: 'name', col_name: 'productName' },
            { label: 'price', col_name: 'productPrice' },
            { label: 'quantity', col_name: 'qty' },
            { label: 'position', col_name: 'position' },
            { label: 'expirated', col_name: 'expiredAt' },
            { label: 'edit', col_name: 'edit' },
          ]}
        />
        {pagination && (
          <div className="items-center justify-center ">
            <Pagination
              currentPage={pagination.paginationParam.page}
              totalPages={pagination.totalPageCount}
              onPageChange={(page) => handlePage(page)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
