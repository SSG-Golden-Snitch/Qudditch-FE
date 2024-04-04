'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'

export async function getData(id) {
  const response = await fetchExtended(`/api/store/location/stock?userStoreId=${id}`)
  return response.json()
}

export default function LocationStockPage({ id }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(id)
      setData(data)
      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data || !data.list || data.list.length === 0) {
    return (
      <div className="bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">재고현황</h2>
        <div className="text-center">해당 스토어에는 재고가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">재고현황</h2>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="제품이름으로 검색"
          className="w-full rounded-md border py-2 pl-4 pr-10 focus:border-gray-500 focus:outline-none"
        />
        <button className="absolute right-0 top-0 mr-4 mt-2">🔍</button>
      </div>
      <div className="grid gap-4">
        {data.list.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-md border p-4">
            <img
              className="mr-4 h-16 w-16 rounded object-cover"
              src={product.productImage}
              alt={product.productName}
            />
            <div className="flex-grow">
              <div className="text-sm font-medium">{product.brand}</div>
              <div className="text-sm">{product.productName}</div>
              <div className="text-sm">{product.productPrice}원</div>
            </div>
            <div className="text-sm font-semibold">{product.qty}개</div>
          </div>
        ))}
      </div>
    </div>
  )
}
