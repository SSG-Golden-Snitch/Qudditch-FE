'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'

export default function Stock() {
  const [pagination, setPagination] = useState([])
  const [storeStock, setStoreStock] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStoreStock = async (page) => {
    setPagination({ page: page, recordSize: 10 })
    console.log(page)
    const storeStockReqUrl = new URL(`http://localhost:8080/api/store/stock?page=${page}`)

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
  }
  useEffect(() => {
    handleStoreStock()
  }, [])

  const handlePage = (page) => {
    handleStoreStock(page)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="h-screen bg-gray-100 p-6 py-16 ">
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
    </div>
  )
}
