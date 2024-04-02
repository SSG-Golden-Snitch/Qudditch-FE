'use client'
import { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const MonthlyVisitor = () => {
  // 백엔드 storeId 2로 고정되있음 props로 대체 예정
  const yearMonth = '2024-03'

  const [result, setResult] = useState(null)

  useEffect(() => {
    const Monthly = async () => {
      try {
        const response = await fetchExtended(`/api/visitor/month?yearMonth=${yearMonth}`)
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    Monthly()
  }, [])

  return (
    <div>
      <h4 className="text-2xl font-bold text-gray-500">총 방문자수</h4>
      <h3 className="text-3xl font-bold text-gray-800">{result ? result + '명' : '0명'}</h3>
    </div>
  )
}

export default MonthlyVisitor
