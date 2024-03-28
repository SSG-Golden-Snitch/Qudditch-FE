'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { CustomTable } from '@/components/customTable'
import { apiUrl } from '@/utils/fetchExtended'
import { Pagination, Select } from 'flowbite-react'
import { useEffect, useState } from 'react'

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
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }
  const handleStoreStock = async (page = 1, categoryId = 0) => {
    setError(null)
    setIsLoading(true)

    const storeStockReqUrl = new URL(
      apiUrl + `/api/store/stock?page=${page}&categoryId=${categoryId}`,
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
      paginationParam: { ...pagination.paginationParam, page },
    })
    handleStoreStock(page, categoryId)
  }

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value)

    handleStoreStock(1, event.target.value)

    setCategoryId(event.target.value)
  }

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>
  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-5">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}
      <div className="px-3 pb-5 pt-5 text-right">
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
              handleData={handleStoreStock}
              handleAlert={handleAlert}
              data={storeStock}
              pagination={pagination}
              header={[
                { label: 'category', col_name: 'categoryName' },
                { label: 'brand', col_name: 'brand' },
                { label: 'name', col_name: 'productName' },
                { label: 'price', col_name: 'productPrice' },
                { label: 'quantity', col_name: 'qty' },
                { label: 'position', col_name: 'positioned' },
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
