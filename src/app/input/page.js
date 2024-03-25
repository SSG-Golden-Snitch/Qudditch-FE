'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'
import { Pagination } from 'flowbite-react'

export default function Input() {
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
  const [storeInput, setStoreInput] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStoreInput = async (page = 1) => {
    setError(null)
    setIsLoading(true)

    const storeInputReqUrl = new URL(`http://localhost:8080/api/store/stock/input?page=${page}`)

    await fetch(storeInputReqUrl, {
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
          setStoreInput(res['data'])
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
    handleStoreInput()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page: page + 1 },
    })
    handleStoreInput(page)
  }

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>

  return (
    <div className="flex h-screen flex-col bg-gray-100 py-10">
      <div className="flex flex-col items-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <CustomTable
              data={storeInput}
              pagination={pagination}
              header={[
                { label: '입고 번호', col_name: 'storeInputId' },
                { label: '상품', col_name: 'items' },
                { label: '입고일', col_name: 'inputAt' },
                { label: '다운로드', col_name: 'download' },
              ]}
            />
            <div className="fixed bottom-1 flex items-center justify-center">
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
