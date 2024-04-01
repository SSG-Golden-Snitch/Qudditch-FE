'use client'

import CategoryGraph from '@/components/CategoryGraph'
import DailyVisitor from '@/components/DailyVisitor'
import MonthlyVisitor from '@/components/MonthlyVisitor'
import SalesGraph from '@/components/SalesGraph'
import VisitorGraph from '@/components/VisitorGraph'
import { redirect } from 'next/navigation'

export default function Home() {
  // if (sessionStorage.getItem('token') == null) {
  //   redirect('/login')
  // }

  return (
    <div className="flex h-full flex-col bg-gray-100 p-4 dark:border-gray-700">
      <div className="flex-row-2 flex h-20">
        <p className="m-2 text-2xl font-bold">Dashboard</p>
      </div>
      <div className="mb-4 grid h-32 grid-cols-4 gap-4">
        <div className="flex items-center justify-center rounded bg-gray-50">
          <MonthlyVisitor />
        </div>
        <div className="flex items-center justify-center rounded bg-gray-50">
          <DailyVisitor />
        </div>
        <div className="rounded bg-gray-50"></div>
        <div className="rounded bg-gray-50"></div>
      </div>
      <div className="mb-4 grid h-full grid-cols-2 gap-4">
        <div className="bg-gray-50">
          <VisitorGraph />
        </div>
        <div className="bg-gray-50">
          <SalesGraph />
        </div>
        <div className="bg-gray-50"></div>
        <div className="bg-gray-50">
          <CategoryGraph />
        </div>
      </div>
    </div>
  )
}
