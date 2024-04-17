'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

import { graphColors } from './graphColors'

export const VisitorGraph = ({ dateInput }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })
  const yearMonth = dateInput
  const [currentList, setCurrentList] = useState([])
  // dataset, 시간대별 날짜 데이터
  const [bindingObj, setBindingObj] = useState({
    '0-6': {},
    '6-12': {},
    '12-18': {},
    '18-24': {},
  })

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
        text: '일일 방문자 현황',
        font: {
          size: 22,
        },
        padding: {
          bottom: 20,
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
  }, [yearMonth])

  useEffect(() => {
    if (currentList == null) {
      setChartData({ labels: [], datasets: [] })
      return
    }

    currentList.forEach((dateEle) => {
      bindingObj['0-6'][dateEle.date.split('-')[2]] = 0
      bindingObj['6-12'][dateEle.date.split('-')[2]] = 0
      bindingObj['12-18'][dateEle.date.split('-')[2]] = 0
      bindingObj['18-24'][dateEle.date.split('-')[2]] = 0
    })

    currentList.forEach((dateEle) => {
      dateEle.list.forEach((hours) => {
        if (0 <= hours.hour && hours.hour < 6) {
          bindingObj['0-6'][dateEle.date.split('-')[2]] += hours.count
        } else if (6 <= hours.hour && hours.hour < 12) {
          bindingObj['6-12'][dateEle.date.split('-')[2]] += hours.count
        } else if (12 <= hours.hour && hours.hour < 18) {
          bindingObj['12-18'][dateEle.date.split('-')[2]] += hours.count
        } else if (18 <= hours.hour && hours.hour < 24) {
          bindingObj['18-24'][dateEle.date.split('-')[2]] += hours.count
        }
      })
    })

    setBindingObj({ ...bindingObj })
  }, [currentList])

  // 차트 그리기
  useEffect(() => {
    if (currentList == null) {
      setChartData({
        labels: [],
        datasets: [{ label: '0-6' }, { label: '6-12' }, { label: '12-18' }, { label: '18-24' }],
      })
      return
    }

    const data = {
      labels: currentList.map((itm) => Number(itm.date.split('-')[2]) + '일'),
      datasets: Object.entries(bindingObj).map(([key, value], index) => {
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
          borderWidth: 3,
          borderColor: graphColors[index],
        }
      }),
    }

    setChartData(data)
  }, [bindingObj])

  return <Line options={options} data={chartData} />
}

export default VisitorGraph

function getRandomColor(alpha) {
  const r = Math.floor(Math.random() * 256) // 0부터 255까지의 랜덤한 숫자
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b}, ${alpha})`
}
