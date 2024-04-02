'use client'
import OrderDetailPage from '@/components/orderProductList'

export async function getData({ params: { id } }) {
  const storeOrder = await getStoreOrder(id)
  return {
    id: storeOrder.id,
  }
}

async function getXlsx(id) {
  const URL = `http://localhost:8080/api/store/order/download/${id}`
  const response = await fetch(URL)
  if (!response.ok) {
    throw new Error('엑셀 파일 다운로드에 실패했습니다.')
  }
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Product order-${id}.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export default async function OrderDetail({ params: { id } }) {
  const handleXlsxClick = async () => {
    try {
      await getXlsx(id)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex flex-col bg-gray-100 py-16">
      <OrderDetailPage id={id} />
      <button onClick={handleXlsxClick}>발주서다운로드</button>
    </div>
  )
}
