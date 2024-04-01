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

const CategoryGraph = () => {
  const chartRef = useRef(null)
  const [currentList, setCurrentList] = useState([])
  const [lastList, setLastList] = useState([])
  const [bindingDataOut, setBindingDataOut] = useState([])
  const [bindingDataIn, setBindingDataIn] = useState([])
  let chartInstance = null
  const yearMonth = '2024-03'

  function CalcBindingOut() {
    if (currentList.length === 0) {
      return
    }

    let list = []

    let etcData = null
    for (let i = 0; i < currentList.length; i++) {
      if (i < RANK_VIEW) {
        list[i] = {
          categoryName: currentList[i].categoryName,
          sales: currentList[i].sales,
        }
      } else {
        if (etcData === null) {
          etcData = {
            categoryName: '기타',
            sales: currentList[i].sales,
          }
        } else {
          etcData.sales += currentList[i].sales
        }
      }
    }

    if (etcData) {
      list[list.length] = etcData
    }

    setBindingDataOut(list)
  }
  // 데이터 불러오기
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await fetchExtended(`/api/graph/category?yearMonth=${yearMonth}`)
        const data = await response.json()
        setCurrentList(data['currentList'])
        setLastList(data['lastList'])
      } catch (error) {
        console.error('error', error)
      }
    }
    getCategory()
  }, [])

  useEffect(() => {
    CalcBindingOut()
  }, [currentList])

  // 차트 그리기
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    const data = {
      labels: bindingDataOut.map((itm) => {
        return itm.categoryName
      }),
      datasets: [
        {
          label: 'category',
          data: bindingDataOut.map((itm) => itm.sales),
          backgroundColor: currentList.map((itm, index) => categoryColor[index]),
          borderColor: 'rgba(23, 54, 321, 1)',
        },
      ],
    }

    const createChart = () => {
      Chart.register(...registerables)
      chartInstance = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: data,
        options: {
          plugins: {
            datalabels: {
              display: true,
              align: 'center',
              anchor: 'center',
              formatter: function (value, context) {
                return value.toLocaleString().replace('$', '')
              },
            },
            title: {
              display: true,
              position: 'top',
              text: 'Top5',
              font: {
                size: 30,
              },
            },
            legend: {
              display: true,
              position: 'right',
              align: 'center',
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
  }, [bindingDataOut])

  return <canvas style={{ maxHeight: '100%' }} ref={chartRef}></canvas>
}

export default CategoryGraph
