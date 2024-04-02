'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { useState, useEffect } from 'react'

const DailySales = () => {
  const yearMonthDay = '2024-03-24'
  const [orderAt, setOrderAt] = useState(yearMonthDay)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const daily = async () => {
      try {
        const response = await fetchExtended(`/api/sales/DailySales?orderedAt=${orderAt}`)
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    daily()
  }, [orderAt])

  // 판매금액을 통화 형식으로 변환하는 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  return (
    <div>
      <h4 className="text-2xl font-bold text-gray-500">당일 판매금액</h4>
      <h3 className="text-3xl font-bold text-gray-800">
        {result && formatCurrency(result[0].totalAmount)}
      </h3>
    </div>
  )
}

export default DailySales
