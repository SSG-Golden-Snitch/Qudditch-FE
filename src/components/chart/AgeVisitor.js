'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labels = ['10대', '20대', '30대', '40대', '50대', '60대', '70대 이상']

const AgeVisitor = () => {
  const [chartData, setChartData] = useState({ labels, datasets: [] })

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
        text: '연령대별 방문자 수',
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

  const handleAgeVisitor = async () =>
    await fetchExtended('/api/visitor/age')
      .then((res) => res.json())
      .then((res) => res['result'])
      .catch((err) => console.error(err))

  useEffect(() => {
    handleAgeVisitor().then((res) => {
      const maleData = Array(labels.length).fill(0)
      const femaleData = Array(labels.length).fill(0)

      res.forEach((entry) => {
        let ageIndex = Math.floor(entry['age_range'] / 10 - 1)
        if (ageIndex < 0) ageIndex = 0
        if (ageIndex >= labels.length) ageIndex = labels.length - 1
        if (entry.gender === 'Male') {
          maleData[ageIndex] += entry.count
        } else if (entry.gender === 'Female') {
          femaleData[ageIndex] += entry.count
        }
      })

      setChartData({
        ...chartData,
        datasets: [
          {
            label: 'Male',
            data: maleData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Female',
            data: femaleData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      })
    })
  }, [])

  return <Bar options={options} data={chartData} />
}

export default AgeVisitor
