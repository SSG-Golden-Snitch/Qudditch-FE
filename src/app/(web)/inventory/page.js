'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { CustomTable } from '@/components/CustomTable'
import Loading from '@/components/ui/Loading'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination, Select } from 'flowbite-react'
import { useEffect, useState } from 'react'

export default function Stock() {
  const [pagination, setPagination] = useState({
    paginationParam: {
      page: 1,
      keyword: "''",
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
  const [keyword, setKeyword] = useState('')

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    handleStoreStock(1, categoryId, keyword)
    setCategoryId(0)
  }

  const handleStoreStock = async (page = 1, categoryId = 0, keyword = '') => {
    setError(null)
    setIsLoading(true)

    const storeStockReqUrl = new URL(
      apiUrl + `/api/store/stock?page=${page}&categoryId=${categoryId}&keyword='${keyword}'`,
    )

    await fetchExtended(storeStockReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          setError(res['message'])
          throw new Error(res['message'])
        } else {
          setStoreStock(res['data'])
          setPagination(res['pagination'])
          console.log(res)
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
    setKeyword('')
  }

  if (isLoading) return <Loading />
  return (
    <div className="flex h-screen flex-col bg-[#e4e4e4]  py-5 ">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}
      <div className="flex w-full py-3 pl-10">
        <div className="pltext-right w-1/2">
          <Select
            className="w-32"
            id="categories"
            onChange={handleCategoryChange}
            value={categoryId}
          >
            <option value={0}>전체</option>
            <option value={1}>과자</option>
            <option value={2}>빵</option>
            <option value={3}>우유</option>
            <option value={4}>라면</option>
            <option value={5}>커피</option>
            <option value={6}>생수</option>
            <option value={7}>음료수</option>
            <option value={9}>즉석밥</option>
            <option value={10}>아이스크림</option>
            <option value={11}>젤리</option>
          </Select>
        </div>

        <div className="mx-10 w-1/2  pl-10">
          <form className="" onSubmit={handleSearch}>
            <label
              htmlFor="default-search"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4  ps-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                placeholder="검색할 제품명을 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="absolute bottom-2.5 end-2.5 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                검색
              </button>
            </div>
          </form>
        </div>
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
