'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'
// import Chart from 'chart.js/auto'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const colors = [
  'rgba(200, 200, 200, 0.5)', // 연한 회색
  'rgba(255, 200, 200, 0.5)', // 연한 분홍색
  'rgba(200, 255, 200, 0.5)', // 연한 녹색
  'rgba(200, 200, 255, 0.5)', // 연한 파란색
]

export const VisitorGraph = () => {
  const yearMonth = '2024-03'
  const [year, month] = yearMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []
  for (let i = 0; i < 31; i++) {
    days[i] = i + 1 + '일'
  }

  const chartRef = useRef(null)
  const [currentList, setCurrentList] = useState([])
  // dataset, 시간대별 날짜 데이터
  const [bindingObj, setBindingList] = useState({
    '0-6': {},
    '6-12': {},
    '12-18': {},
    '18-24': {},
  })

  let chartInstance = null

  // 데이터 불러오기
  useEffect(() => {
    const getVisitor = async () => {
      try {
        const response = await fetchExtended(`/api/graph/visitor?yearMonth=${yearMonth}`)
        const data = await response.json()
        setCurrentList(data['list'])
      } catch (error) {
        console.error('error', error)
      }
    }
    getVisitor()
  }, [])

  useEffect(() => {
    currentList.forEach((dateEle) => {
      bindingObj['0-6'][dateEle.date.split('-')[2]] = 0
    })

    currentList.forEach((dateEle) => {
      dateEle.list.forEach((hours) => {
        if (0 <= hours.hour && hours.hour < 6) {
          bindingObj['0-6'][dateEle.date.split('-')[2]] = hours.count
        } else if (6 <= hours.hour && hours.hour < 12) {
          bindingObj['6-12'][dateEle.date.split('-')[2]] = hours.count
        } else if (12 <= hours.hour && hours.hour < 18) {
          bindingObj['12-18'][dateEle.date.split('-')[2]] = hours.count
        } else if (18 <= hours.hour && hours.hour < 24) {
          bindingObj['18-24'][dateEle.date.split('-')[2]] = hours.count
        }
      })
    })

    setBindingList({ ...bindingObj })
  }, [currentList])

  // 차트 그리기
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    console.log(Object.values(bindingObj)[0])

    const data = {
      labels: currentList.map((itm) => Number(itm.date.split('-')[2]) + '일'),
      datasets: Object.entries(bindingObj).map(([key, value, index]) => {
        let finalDatas = currentList.map((list) => {
          let day = list.date.split('-')[2]

          if (day in value) {
            return value[day]
          } else {
            return 0
          }
        })

        // 한줄씩
        // dataset
        return {
          label: key,
          data: finalDatas,
          backgroundColor: colors[index],
          borderWidth: 3,
        }
      }),
    }

    const createChart = () => {
      Chart.register(...registerables)
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          plugins: {
            title: {
              display: true,
              text: '일일 방문자 현황',
              font: {
                size: 30,
              },
            },
          },
        },
      })
    }

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    destroyChart() // 기존 차트 파괴
    createChart() // 새로운 차트 생성

    return () => {
      destroyChart() // 컴포넌트가 unmount될 때 차트 파괴
    }
  }, [bindingObj])

  return <canvas ref={chartRef}></canvas>
}

export default VisitorGraph

function getRandomColor(alpha) {
  const r = Math.floor(Math.random() * 256) // 0부터 255까지의 랜덤한 숫자
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b}, ${alpha})`
}
