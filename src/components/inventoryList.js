'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
export async function getData(id) {
  const response = await fetchExtended(`/api/store/location/stock?userStoreId=${id}`)
  return response.json()
}

export default function LocationStockPage({ id }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData(id)
        setData(result)
        if (!result || !result.list || result.list.length === 0) {
          alert('선택한 스토어에 재고가 없습니다.')
        }
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error)
        alert('데이터 로딩 중 오류가 발생했습니다.')
      }
    }

    fetchData()
  }, [id])

  if (!data || !data.list || data.list.length === 0) {
    return <div>데이터가 없습니다.</div>
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
