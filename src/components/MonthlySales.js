'use client'
import { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const MonthlySales = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // getMonth()는 0부터 시작하므로 1을 더합니다.

  const [yearMonth, setYearMonth] = useState(`${year}-${month}`)
  const [userStoreId, setUserStoreId] = useState(2)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const Monthly = async () => {
      try {
        const response = await fetchExtended(
          `/api/sales/MonthlySales?yearMonth=${yearMonth}&userStoreId=${userStoreId}`,
        )
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    Monthly()
  }, [yearMonth, userStoreId])

  // 판매금액을 통화 형식으로 변환하는 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  return (
    <div>
      <p>월 판매금액</p>
      {result && result.map((item, index) => <p key={index}>{formatCurrency(item.price)}</p>)}
    </div>
  )
}

export default MonthlySales
