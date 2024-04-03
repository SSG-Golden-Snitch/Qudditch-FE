'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { useState, useEffect } from 'react'

const DailySales = ({ dateInput }) => {
  const yearMonthDay = dateInput
  const [result, setResult] = useState(null)

  useEffect(() => {
    const daily = async () => {
      try {
        const response = await fetchExtended(`/api/sales/DailySales?orderedAt=${yearMonthDay}`)
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    daily()
  }, [yearMonthDay])

  // 판매금액을 통화 형식으로 변환하는 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  return (
    <div>
      <h4 className="text-2xl font-bold text-gray-500">당일 판매금액</h4>
      <h3 className="text-3xl font-bold text-gray-800">
        {result && result.length > 0 && result[0]
          ? formatCurrency(result[0].totalAmount)
          : formatCurrency(0)}
      </h3>
    </div>
  )
}

export default DailySales
