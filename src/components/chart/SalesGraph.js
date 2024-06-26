'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Filler, Title, Tooltip, Legend)

import { graphColors } from './graphColors'

const SalesGraph = ({ dateInput }) => {
  const yearMonth = dateInput
  const [currentList, setCurrentList] = useState([])
  const [bindingList, setBindingList] = useState([])
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '매출 현황',
        font: {
          size: 22,
        },
        padding: {
          bottom: 22,
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
    maintainAspectRatio: false,
  }

  // 데이터 불러오기
  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await fetchExtended(`/api/graph/sales?yearMonth=${yearMonth}`)
        const data = await response.json()

        if (data['list'] == null) {
          return
        }

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
    const data = {
      labels: bindingList.map((itm) => {
        return Number(itm.date.split('-')[2]) + '일'
      }),
      datasets: [
        {
          label: '매출',
          data: bindingList.map((itm) => itm.sales),
          borderColor: '#fde047',
          tension: 0.3,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx
            const gradient = ctx.createLinearGradient(0, 0, 0, 300)
            gradient.addColorStop(0, '#ffe454')
            gradient.addColorStop(1, '#fff')
            return gradient
          },
          fill: true,
        },
      ],
    }

    setChartData(data)
  }, [bindingList])

  return <Line options={options} data={chartData} />
}

export default SalesGraph
