'use client'

import { CustomTable } from '@/components/customTable'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination } from 'flowbite-react'
import { useEffect, useState } from 'react'

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

    const storeInputReqUrl = new URL(apiUrl + `/api/store/stock/input?page=${page}`)

    await fetchExtended(storeInputReqUrl, {
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
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-10">
      <div className="flex flex-col items-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <CustomTable
              data={storeInput}
              pagination={pagination}
              header={[
                { label: 'No', col_name: 'storeInputId' },
                { label: 'products', col_name: 'items' },
                { label: 'input', col_name: 'inputAt' },
                { label: 'state', col_name: 'state' },
                { label: 'download', col_name: 'download' },
              ]}
            />
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
