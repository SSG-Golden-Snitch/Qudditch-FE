'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { CustomTable } from '@/components/CustomTable'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination } from 'flowbite-react'
import { useEffect, useState } from 'react'
import Loading from '@/components/ui/Loading'

export default function Store() {
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
  const [store, setStore] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleStore = async (page = 1) => {
    setError(null)
    setIsLoading(true)

    const storeReqUrl = new URL(apiUrl + `/api/manage/store?page=${page}`)

    await fetchExtended(storeReqUrl, {
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
          setStore(res['data'])
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
    handleStore()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page },
    })
    handleStore(page)
  }

  if (isLoading) return <Loading />
  return (
    <div className="flex h-screen flex-col bg-[#e4e4e4]  py-16">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <div className="flex flex-col items-center pt-10">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <CustomTable
              handleData={handleStore}
              handleAlert={handleAlert}
              data={store}
              pagination={pagination}
              header={[
                { label: 'id', col_name: 'id' },
                { label: 'storename', col_name: 'storeName' },
                { label: '대표명', col_name: 'name' },
                { label: 'phone', col_name: 'phone' },
                { label: 'EMAIL', col_name: 'email' },
                { label: 'address', col_name: 'address' },
                // { label: 'createAt', col_name: 'createdAt' },
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
