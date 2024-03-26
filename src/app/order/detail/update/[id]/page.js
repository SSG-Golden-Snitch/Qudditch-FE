'use client'
import GetDetail from '@/components/orderUpdateList'

export async function getData({ params: { id } }) {
  const storeOrder = await getStoreOrder(id)
  return {
    id: storeOrder.id,
  }
}

export default async function OrderUpdate({ params: { id } }) {
  return (
    <div className="flex flex-col bg-gray-100 py-16">
      <GetDetail id={id} />
    </div>
  )
}
