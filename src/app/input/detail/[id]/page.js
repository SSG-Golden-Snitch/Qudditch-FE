'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'

export default function InputDetail({ params: { id } }) {
  const [error, setError] = useState(null)
  const [inputDetail, setInputDetail] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputDetailReqUrl = `http://localhost:8080/api/store/stock/input/${id}`
  const handleData = () => {
    fetch(inputDetailReqUrl, {
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
          setInputDetail(res['data'])
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
    setIsLoading(true)
    handleData()
  }, [])

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-10">
      <div className="flex flex-col items-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <CustomTable
              data={inputDetail}
              header={[
                { label: 'productId', col_name: 'productId' },
                { label: 'brand', col_name: 'brand' },
                { label: 'name', col_name: 'name' },
                { label: 'price', col_name: 'price' },
                { label: 'quantity', col_name: 'qty' },
                { label: 'expirated', col_name: 'expDate' },
                { label: 'state', col_name: 'state' },
                { label: 'position', col_name: 'position' },
                { label: 'check', col_name: 'check' },
              ]}
            />
          </>
        )}
      </div>
    </div>
  )
}
