'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
export async function getData(id, page = 1, recordSize = 5) {
  const response = await fetchExtended(
    `/api/store/location/stock?userStoreId=${id}&page=${page}&recordSize=${recordSize}`,
  )
  return response.json()
}

export default function LocationStockPage({ id }) {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (loading || !hasMore) return
      setLoading(true)

      try {
        const result = await getData(id, page)
        setData((prevData) => [...prevData, ...result.list])
        setHasMore(result.pagination.totalPageCount > page)
        setPage((prevPage) => prevPage + 1)
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, page, hasMore, loading])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1)
      }
    }, options)

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [loading, hasMore])

  if (data.length === 0 && !loading) {
    alert('선택한 스토어에 재고가 없습니다.')
    router.push('/map')
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
        {loading && <div>Loading more items...</div>}
      </div>
      <div ref={loader} />
    </div>
  )
}
