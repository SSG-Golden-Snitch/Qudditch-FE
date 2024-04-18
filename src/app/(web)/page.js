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
    <div className="flex h-screen flex-col bg-[#e4e4e4] px-4 dark:border-gray-700">
      <div className="flex h-14 justify-end">
        <div className={'py-2'}>
          <Datepicker
            options={{ datepickerClassNames: 'right-4' }}
            onChange={handleChange}
            show={show}
            setShow={handleClose}
          />
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
      <div className="mb-4 grid h-full grid-cols-2 gap-4 ">
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
