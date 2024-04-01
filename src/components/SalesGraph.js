'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'
// import Chart from 'chart.js/auto'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const RANK_VIEW = 4
const categoryColor = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(204, 0, 204)',
  'rgb(153, 255, 255)',
]

const SalesGraph = () => {
  const chartRef = useRef(null)
  const [currentList, setCurrentList] = useState([])
  let chartInstance = null
  const yearMonth = '2024-03'

  // 데이터 불러오기
  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await fetchExtended(`/api/graph/sales?yearMonth=${yearMonth}`)
        const data = await response.json()

        setCurrentList(data['list'])
      } catch (error) {
        console.error('error', error)
      }
    }
    getSales()
  }, [])

  // 차트 그리기
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    const data = {
      labels: currentList.map((itm) => {
        return Number(itm.date.split('-')[2]) + '일'
      }),
      datasets: [
        {
          label: '매출',
          data: currentList.map((itm) => itm.sales),
          backgroundColor: 'rgba(23, 54, 321, 0.2)',
          borderColor: 'rgba(23, 54, 321, 1)',
          fill: true,
        },
      ],
    }

    const createChart = () => {
      Chart.register(...registerables)
      chartInstance = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'line',
        data: data,
        options: {
          plugins: {
            datalabels: {
              display: false,
              align: 200,
              formatter: function (value, context) {
                return value.toLocaleString().replace('$', '')
              },
            },
            title: {
              display: true,
              text: '일일 매출현황',
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
  }, [currentList])

  return <canvas ref={chartRef}></canvas>
}

export default SalesGraph
