'use client'

import BestProduct from '@/components/BestProduct'
import CategoryGraph from '@/components/CategoryGraph'
import DailySales from '@/components/DailySales'
import DailyVisitor from '@/components/DailyVisitor'
import MonthlySales from '@/components/MonthlySales'
import MonthlyVisitor from '@/components/MonthlyVisitor'
import SalesGraph from '@/components/SalesGraph'
import VisitorGraph from '@/components/VisitorGraph'

export default function Home() {
  return (
    <div className="flex h-full flex-col bg-gray-100 p-4 dark:border-gray-700">
      <div className="flex h-20 justify-between">
        <p className="m-2 text-2xl font-bold">Dashboard</p>
      </div>
      <div className="mb-4 grid h-24 grid-cols-4 gap-4">
        <div className="flex items-center justify-center rounded bg-gray-50">
          <MonthlyVisitor />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <DailyVisitor />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <MonthlySales />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <DailySales />
        </div>
      </div>
      <div className="mb-4 grid h-full grid-cols-2 gap-4">
        <div className="bg-gray-50 px-6">
          <VisitorGraph />
        </div>
        <div className="bg-gray-50 px-6">
          <SalesGraph />
        </div>
        <div className="bg-gray-50 px-6">
          <BestProduct />
        </div>
        <div className="bg-gray-50 px-6">
          <CategoryGraph />
        </div>
      </div>
    </div>
  )
}
