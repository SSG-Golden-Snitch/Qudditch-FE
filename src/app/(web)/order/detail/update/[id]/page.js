'use client'

import GetDetail from '@/components/orderUpdateList'

export default function OrderUpdate({ params: { id } }) {
  return (
    <div className="flex flex-col bg-gray-100 py-16">
      <GetDetail id={id} />
    </div>
  )
}
