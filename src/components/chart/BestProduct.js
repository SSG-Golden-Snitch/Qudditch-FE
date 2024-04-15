'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'

const BestProduct = () => {
  const [labels, setLabels] = useState([])
  const [productDataSet, setProductDataSet] = useState([])

  useEffect(() => {
    const best = async () => {
      try {
        const response = await fetchExtended(`/api/product/BestProduct`)
        const data = await response.json()
        const bindingData = data['bestProducts'].filter((product) => product['outQty'] !== 0)
        setLabels(bindingData.map((product) => product['name']))
        setProductDataSet(bindingData.map((product) => product.outQty))
      } catch (error) {
        console.error('error', error)
      }
    }
    best()
  }, [])

  const chartRef = useRef(null)
  const [chartInstance, setChartInstance] = useState(null)

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy()
    }

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
            text: 'Best 5 제품',
            font: {
              size: 25,
            },
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 10,
          },
        },
      },
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

    const ctx = chartRef.current.getContext('2d')
    const newChartInstance = new Chart(ctx, config)
    setChartInstance(newChartInstance)

    return () => {
      newChartInstance.destroy()
    }
  }, [labels, productDataSet])

  return <canvas style={{ maxHeight: '85%' }} ref={chartRef} />
}

export default BestProduct
