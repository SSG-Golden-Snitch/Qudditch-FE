'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { useState, useEffect } from 'react'

const DailySales = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1 // getMonth()는 0부터 시작하므로 1을 더합니다.
  const day = currentDate.getDate() - 3

  const [orderAt, setOrderAt] = useState(`${year}-${month}-${day}`)
  const [userStoreId, setUserStoreId] = useState(2)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const daily = async () => {
      try {
        const response = await fetchExtended(
          `/api/sales/DailySales?orderedAt=${orderAt}&userStoreId=${userStoreId}`,
        )
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    daily()
  }, [orderAt, userStoreId])

  // 판매금액을 통화 형식으로 변환하는 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  return (
    <div>
      <p>당일 판매금액</p>
      {result && result.map((item, index) => <p key={index}>{formatCurrency(item.totalAmount)}</p>)}
    </div>
  )
}

export default DailySales
