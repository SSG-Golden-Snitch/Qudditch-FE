'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

const RANK_VIEW = 4

const CategoryGraph = () => {
  const yearMonth = '2024-03'
  const [labels, setLabels] = useState([])
  const [productDataSet, setProductDataSet] = useState([])

  useEffect(() => {
    const getCategorys = async () => {
      try {
        const response = await fetchExtended(`/api/graph/category?yearMonth=${yearMonth}`)
        const data = await response.json()

        let currentList = data.currentList
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

        setLabels(list.map((category) => category.categoryName))
        setProductDataSet(list.map((category) => category.sales))
      } catch (error) {
        console.error('error', error)
      }
    }
    getCategorys()
  }, [])

  const chartRef = useRef(null)
  const [chartInstance, setChartInstance] = useState(null)

  useEffect(() => {
    if (labels.length !== 0) {
      if (chartInstance) {
        chartInstance.destroy()
      }
      const ctx = chartRef.current.getContext('2d')
      const newChartInstance = new Chart(ctx, config)
      setChartInstance(newChartInstance)

      return () => {
        newChartInstance.destroy()
      }
    }
  }, [labels, productDataSet])

  const config = {
    type: 'doughnut',
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'right',
          align: 'center',
        },
        title: {
          display: true,
          position: 'top',
          text: 'Top 5 카테고리',
          font: {
            size: 30,
          },
        },
      },
    },
    data: {
      labels,
      datasets: [
        {
          label: '카테고리',
          data: productDataSet,
          backgroundColor: [
            'rgb(232, 232, 232)',
            'rgb(100, 100, 100)',
            'rgb(86, 86, 86)',
            'rgb(145, 145, 145)',
            'rgb(200, 200, 200)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  }

  return (
    <div>
      <canvas style={{ maxHeight: '100%' }} ref={chartRef} />
    </div>
  )
}

export default CategoryGraph
