'use client'
import { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const DailyVisitor = () => {
  // 백엔드 storeId 2로 고정되있음
  const yearMonthDay = '2024-03-20'
  const [ymdState, setYmdState] = useState(yearMonthDay)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const Monthly = async () => {
      try {
        // 백에 "'2024-03-24'"처럼 문자열을 ''로 감싼걸 줘야함
        const response = await fetchExtended(`/api/visitor/daily?date='${ymdState}'`)
        const data = await response.json()
        setResult(data)
      } catch (error) {
        console.error('error', error)
      }
    }

    Monthly()
  }, [ymdState])

  const leftClick = () => {
    let ymdArr = ymdState.split('-')
    let monthDay = Number(ymdArr[2])

    monthDay--

    if (monthDay === 0) {
      return
    } else {
      let date = new Date(ymdState)

      // 날짜를 1일 감소시킴
      date.setDate(date.getDate() - 1)

      // 변경된 날짜를 ISO 형식의 문자열로 변환
      let prevDay = date.toISOString().slice(0, 10)
      setYmdState(prevDay)
    }
  }

  const rightClick = () => {
    // 다음 달의 0일을 구하여 이전 월의 마지막 날짜를 얻음
    let ymdArr = ymdState.split('-')
    let year = Number(ymdArr[0])
    let monthIdx = Number(ymdArr[1]) - 1
    let monthDay = Number(ymdArr[2])
    const lastMonthDay = new Date(year, monthIdx + 1, 0).getDate()

    monthDay++

    if (monthDay > lastMonthDay) {
      return
    } else {
      let date = new Date(ymdState)

      // 날짜를 1일 감소시킴
      date.setDate(date.getDate() + 1)

      // 변경된 날짜를 ISO 형식의 문자열로 변환
      let nextDay = date.toISOString().slice(0, 10)
      setYmdState(nextDay)
    }
  }

  return (
    <div>
      <h4 className="text-2xl font-bold text-gray-500">일 방문자수</h4>
      <h3 className="text-3xl font-bold text-gray-800">{result + '명'}</h3>
    </div>
  )
}

export default DailyVisitor
