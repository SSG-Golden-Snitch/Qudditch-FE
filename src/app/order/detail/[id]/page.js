import OrderDetailPage from '@/components/orderProductList'

export async function getData({ params: { id } }) {
  const storeOrder = await getStoreOrder(id)
  return {
    id: storeOrder.id,
  }
}

export default async function OrderDetail({ params: { id } }) {
  return (
    <div className="flex flex-col bg-gray-100 py-16">
      <OrderDetailPage id={id} />
    </div>
  )
}
