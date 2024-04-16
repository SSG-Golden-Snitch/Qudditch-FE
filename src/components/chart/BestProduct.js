'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useRef, useState } from 'react'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  LineElement,
  Tooltip,
  PointElement,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { doughnutChartColor } from './doughnutChartColor'

ChartJS.register(
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
)

const BestProduct = () => {
  const [labels, setLabels] = useState([])
  const [productDataSet, setProductDataSet] = useState([])
  const [chartData, setChartData] = useState({ labels, datasets: [] })

  const options = {
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
      },
      title: {
        display: true,
        text: 'Best 5 제품',
        font: {
          size: 25,
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

  useEffect(() => {
    const best = async () => {
      try {
        const response = await fetchExtended(`/api/product/BestProduct`)
        const data = await response.json()
        if (data['bestProducts'] == null) {
          return
        }
        const bindingData = data['bestProducts'].filter((product) => product['outQty'] !== 0)
        setLabels(bindingData.map((product) => product['name']))
        setProductDataSet(bindingData.map((product) => product.outQty))
      } catch (error) {
        console.error('error', error)
      }
    }
    best()
  }, [])

  useEffect(() => {
    const data = {
      labels,
      datasets: [
        {
          label: '인기 제품',
          data: productDataSet,
          backgroundColor: doughnutChartColor,
          hoverOffset: 4,
        },
      ],
    }

    setChartData(data)
  }, [labels, productDataSet])

  return <Doughnut options={options} data={chartData} />
}

export default BestProduct
