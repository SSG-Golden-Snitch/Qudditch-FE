'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const GenderVisitor = () => {
  const [chartData, setChartData] = useState({ datasets: [] })

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
      },
      title: {
        display: true,
        text: '성별 방문자수',
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

  const handleGenderVisitor = async () =>
    await fetchExtended('/api/visitor/gender')
      .then((res) => res.json())
      .then((res) =>
        res['result'].reduce(
          (acc, cur) => {
            acc.labels.push(cur['gender'])
            acc.datasets[0].data.push(cur['count'])
            return acc
          },
          {
            labels: [],
            datasets: [
              {
                label: 'Visitor',
                data: [],
                backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
              },
            ],
          },
        ),
      )
      .catch((err) => console.error(err))

  useEffect(() => {
    handleGenderVisitor().then((res) => setChartData(res))
  }, [])

  return <Pie options={options} data={chartData} />
}

export default GenderVisitor
