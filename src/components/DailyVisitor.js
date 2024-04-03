'use client'
import { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const DailyVisitor = ({ dateInput }) => {
  const yearMonthDay = dateInput
  const [result, setResult] = useState(null)

  useEffect(() => {
    const Monthly = async () => {
      try {
        // 백에 "'2024-03-24'"처럼 문자열을 ''로 감싼걸 줘야함
        const response = await fetchExtended(`/api/visitor/daily?date='${yearMonthDay}'`)
        const data = await response.json()

        if (data.status !== 500) {
          setResult(data)
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    Monthly()
  }, [yearMonthDay])

  return (
    <div>
      <h4 className="text-2xl font-bold text-gray-500">일 방문자수</h4>
      <h3 className="text-3xl font-bold text-gray-800">{result ? `${result}명` : '0명'}</h3>
    </div>
  )
}

export default DailyVisitor
