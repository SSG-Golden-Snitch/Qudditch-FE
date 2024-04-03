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
      <h4 className="text-2xl font-bold text-gray-500">당월 판매금액</h4>
      <h3 className="text-3xl font-bold text-gray-800">
        {result && result.length > 0 && result[0]
          ? formatCurrency(result[0].price)
          : formatCurrency(0)}
      </h3>
    </div>
  )
}

export default MonthlySales
