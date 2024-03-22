'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'

export default function Stock() {
  const [pagination, setPagination] = useState({
    page: 2,
    recordSize: 10,
  })
  const [storeStock, setStoreStock] = useState([])

  const handleStoreStock = async () => {
    const storeStockReqUrl = new URL('http://localhost:8080/api/store/stock')
    storeStockReqUrl.searchParams.append('page', pagination['page'])
    storeStockReqUrl.searchParams.append('recordSize', pagination['recordSize'])

    setPagination({ ...pagination, page: pagination['page'] + 1 })

    console.log(pagination['page'])

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

  return (
    <div className="h-screen bg-gray-100 p-6 py-16 sm:ml-48">
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
