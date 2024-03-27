'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

const BestProduct = () => {
  const [storeId, setStoreId] = useState(6)
  const [labels, setLabels] = useState([])
  const [productDataSet, setProductDataSet] = useState([])

  useEffect(() => {
    const best = async () => {
      try {
        const response = await fetchExtended(`/api/product/BestProduct?storeId=${storeId}`)
        const data = await response.json()
        setLabels(data['bestProducts'].map((product) => product['name']))
        setProductDataSet(data['bestProducts'].map((product) => product.outQty))
      } catch (error) {
        console.error('error', error)
      }
    }
    best()
  }, [storeId])

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
    data: {
      labels,
      datasets: [
        {
          label: '인기 제품',
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
      <canvas ref={chartRef} />
    </div>
  )
}

export default BestProduct
