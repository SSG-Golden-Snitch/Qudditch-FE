'use client'

import BestProduct from '@/components/chart/BestProduct'
import CategoryGraph from '@/components/chart/CategoryGraph'
import DailySales from '@/components/DailySales'
import DailyVisitor from '@/components/DailyVisitor'
import MonthlySales from '@/components/MonthlySales'
import MonthlyVisitor from '@/components/MonthlyVisitor'
import SalesGraph from '@/components/chart/SalesGraph'
import VisitorGraph from '@/components/chart/VisitorGraph'
import { useState } from 'react'

import Datepicker from 'tailwind-datepicker-react'
import { Carousel } from 'flowbite-react'
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai'
import AgeVisitor from '@/components/chart/AgeVisitor'
import GenderVisitor from '@/components/chart/GenderVisitor'
import AgeBestProduct from '@/components/chart/AgeBestProduct'
import GenderBestProduct from '@/components/chart/GenderBestProduct'

const customTheme = {
  root: {
    leftControl:
      'absolute left-0 top-0 flex h-full items-center justify-center px-0 focus:outline-none',
    rightControl:
      'absolute right-0 top-0 flex h-full items-center justify-center px-0 focus:outline-none',
  },
}

export default function Home() {
  const [show, setShow] = useState(false)
  const [date, setDate] = useState(dateToYYYYMMDD(new Date()))

  const handleChange = (selectedDate) => {
    setDate(dateToYYYYMMDD(selectedDate))
  }
  const handleClose = (state) => {
    setShow(state)
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-4 dark:border-gray-700">
      <div className="flex h-14 items-center justify-between">
        <p className="m-2 text-2xl font-bold">Dashboard</p>
        <div className="mr-20">
          <Datepicker onChange={handleChange} show={show} setShow={handleClose} />
        </div>
      </div>
      <div className="mb-4 grid h-24 grid-cols-4 gap-4">
        <div className="flex items-center justify-center rounded bg-gray-50">
          <MonthlyVisitor dateInput={date.substring(0, 7)} />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <DailyVisitor dateInput={date} />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <MonthlySales dateInput={date.substring(0, 7)} />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <DailySales dateInput={date} />
        </div>
      </div>
      <Carousel
        theme={customTheme}
        indicators={false}
        slide={false}
        leftControl={
          <div className={'text-4xl'}>
            <AiOutlineLeftCircle />
          </div>
        }
        rightControl={
          <div className={'text-4xl'}>
            <AiOutlineRightCircle />
          </div>
        }
        className={'h-[calc(100vh-9.5rem)] shrink-0 pb-4'}
      >
        <div className="grid h-full grid-cols-2 gap-4">
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <VisitorGraph dateInput={date.substring(0, 7)} />
          </div>
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <SalesGraph dateInput={date.substring(0, 7)} />
          </div>
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <BestProduct />
          </div>
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <CategoryGraph dateInput={date.substring(0, 7)} />
          </div>
        </div>
        <div className="mb-4 grid h-full grid-cols-2 gap-4 ">
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <AgeVisitor />
          </div>
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <GenderVisitor />
          </div>
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <AgeBestProduct />
          </div>
          <div className="flex h-[calc(((100vh-9.5rem)/2)-1rem)] items-center justify-center bg-gray-50 px-6">
            <GenderBestProduct />
          </div>
        </div>
      </Carousel>
    </div>
  )
}

function dateToYYYYMMDD(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateString = `${year}-${month}-${day}`

  return dateString
}
