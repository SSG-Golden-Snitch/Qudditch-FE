'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'
import { Pagination, Select } from 'flowbite-react'

export default function Stock() {
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
  const [storeStock, setStoreStock] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categoryId, setCategoryId] = useState(0)

  const handleStoreStock = async (page = 1, categoryId = 0) => {
    setError(null)
    setIsLoading(true)

    const storeStockReqUrl = new URL(
      `http://localhost:8080/api/store/stock?page=${page}&categoryId=${categoryId}`,
    )

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
        if (res['status'] === 'fail') {
          throw new Error(res['message'])
        } else {
          setStoreStock(res['data'])
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
    handleStoreStock()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page: page + 1 },
    })
    handleStoreStock(page)
  }

  const handleCategoryChange = (event) => {
    const selectedCategoryId = parseInt(event.target.value)
    console.log(selectedCategoryId)
    handleStoreStock(1, selectedCategoryId)

    setCategoryId(selectedCategoryId)
  }

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-5">
      <div className="px-3 pb-5 text-right">
        <Select
          className="w-32"
          id="categories"
          required
          onChange={handleCategoryChange}
          value={categoryId}
        >
          <option value={0}>전체</option>
          <option value={1}>과자</option>
          <option value={2}>아이스크림</option>
          <option value={3}>초콜릿</option>
          <option value={4}>젤리/푸딩</option>
          <option value={5}>시리얼</option>
          <option value={6}>음료수</option>
          <option value={7}>생수</option>
          <option value={8}>우유</option>
          <option value={9}>라면</option>
        </Select>
      </div>
      <div className="flex flex-col items-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
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
            <div className="relative items-center justify-center pt-10">
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
