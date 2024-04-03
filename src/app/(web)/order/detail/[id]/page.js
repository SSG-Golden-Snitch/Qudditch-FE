'use client'
import OrderDetailPage from '@/components/orderProductList'
import { fetchExtended } from '@/utils/fetchExtended'
import { useRouter } from 'next/navigation'

export async function getData({ params: { id } }) {
  const storeOrder = await getStoreOrder(id)
  return {
    id: storeOrder.id,
  }
}

async function getXlsx(id) {
  const URL = `/api/store/order/download/${id}`
  const response = await fetchExtended(URL)
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
  const router = useRouter()
  const handleXlsxClick = async () => {
    try {
      await getXlsx(id)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="h-screen overflow-x-auto bg-gray-100 px-10 py-10">
      <OrderDetailPage id={id} />
      <br />
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className="inline-flex items-center rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:text-gray-700 focus:ring-2 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
          onClick={() => router.push(`update/${id}`)}
        >
          <svg
            className="mr-2 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
            />
          </svg>
          발주수정
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-r-lg border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:text-gray-700 focus:ring-2 focus:ring-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500"
          onClick={handleXlsxClick}
        >
          <svg
            className="mr-2 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
            <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
          </svg>
          OrderDownload
        </button>
      </div>
    </div>
  )
}
