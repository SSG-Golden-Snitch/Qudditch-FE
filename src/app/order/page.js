'use client'
import { useEffect, useState } from 'react'
import '../globals.css'

export default function Order() {
  const [orderList, setOrderList] = useState([])
  const [pagination, setPagination] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/store/order?page=${page}`)
      if (!response.ok) {
        throw new Error('네트워크 연결실패')
      }
      const data = await response.json()
      setOrderList(data.orderList)
      setPagination(data.pagination)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handlePage = (page) => {
    fetchData(page)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4 sm:ml-48">
      <table>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>상태</th>
            <th>주문일자</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr>
              <td>{order.id}</td>
              <td>{order.state}</td>
              <td>{order.orderedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div>
          <button
            onClick={() => handlePage(pagination.startPage - 1)}
            disabled={!pagination.existPrev}
          >
            Prev
          </button>
          {Array.from(
            { length: pagination.endPage - pagination.startPage + 1 },
            (_, i) => pagination.startPage + i,
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePage(page)}
              disabled={page === pagination.paginationParam.page}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePage(pagination.endPage + 1)}
            disabled={!pagination.existNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
