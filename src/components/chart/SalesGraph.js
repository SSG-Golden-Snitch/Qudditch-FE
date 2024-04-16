'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'
// import chart from 'chart.js/auto'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { graphColors } from './graphColors'

const RANK_VIEW = 4
const categoryColor = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(204, 0, 204)',
  'rgb(153, 255, 255)',
]

const SalesGraph = ({ dateInput }) => {
  const yearMonth = dateInput
  const chartRef = useRef(null)
  const [currentList, setCurrentList] = useState([])
  const [bindingList, setBindingList] = useState([])
  let chartInstance = null

  // 데이터 불러오기
  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await fetchExtended(`/api/graph/sales?yearMonth=${yearMonth}`)
        const data = await response.json()

        setCurrentList(data['list'].filter((itm) => itm.sales !== 0))
      } catch (error) {
        console.error('error', error)
      }
    }
    getSales()
  }, [yearMonth])

  // 표현될 데이터
  useEffect(() => {
    if (currentList == null) {
      return
    }

    setBindingList(currentList)
  }, [currentList])

  // 차트 그리기
  useEffect(() => {
    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    destroyChart() // 기존 차트 파괴

    const ctx = chartRef.current.getContext('2d')

    const data = {
      labels: bindingList.map((itm) => {
        return Number(itm.date.split('-')[2]) + '일'
      }),
      datasets: [
        {
          label: '매출',
          data: bindingList.map((itm) => itm.sales),
          borderColor: graphColors[3],
          backgroundColor: graphColors[5],
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
                return value
              },
            },
            title: {
              display: true,
              text: '일일 매출현황',
              font: {
                size: 25,
              },
            },
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 20,
              bottom: 10,
            },
          },
        },
      })
    }

    createChart() // 새로운 차트 생성

    return () => {
      destroyChart() // 컴포넌트가 unmount될 때 차트 파괴
    }
  }, [bindingList])

  return <canvas ref={chartRef}></canvas>
}

export default SalesGraph