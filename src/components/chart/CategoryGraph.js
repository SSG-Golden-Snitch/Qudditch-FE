'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import React, { useEffect, useState } from 'react'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { doughnutChartColor } from './doughnutChartColor'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const RANK_VIEW = 4

const CategoryGraph = ({ dateInput }) => {
  const yearMonth = dateInput
  const [labels, setLabels] = useState([])
  const [productDataSet, setProductDataSet] = useState([])
  const [chartData, setChartData] = useState({ labels, datasets: [] })

  const tooltip = {
    callbacks: {
      label: function (context) {
        return `매출: ₩${context.formattedValue}`
      },
    },
  }

  const options = {
    plugins: {
      tooltip: tooltip,
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: 'Top 5 카테고리(월)',
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

  useEffect(() => {
    const getCategorys = async () => {
      try {
        const response = await fetchExtended(`/api/graph/category?yearMonth=${yearMonth}`)
        const data = await response.json()

        let currentList = data.currentList

        if (currentList == null) {
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

        list = list.filter((category) => category['sales'] !== 0)
        setLabels(list.map((category) => category.categoryName))
        setProductDataSet(list.map((category) => category.sales))
      } catch (error) {
        console.error('error', error)
      }
    }
    getCategorys()
  }, [yearMonth])

  useEffect(() => {
    const data = {
      labels,
      datasets: [
        {
          label: '매출',
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

export default CategoryGraph
