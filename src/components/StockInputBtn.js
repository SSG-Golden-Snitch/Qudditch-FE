'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'

export function StockInputBtn({
  storeInputId,
  quantity,
  expirationDate,
  productId,
  handleAlert,
  handleData,
}) {
  const inputConfirmUrl = apiUrl + `/api/manage/order/detail/${storeInputId}`
  const inputConfirmBody = {
    productId: productId,
    qty: quantity,
    expirationDate: expirationDate,
  }

  const handleSubimt = () => {
    fetchExtended(inputConfirmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(inputConfirmBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          alert(res['message'])
        }
        handleAlert('success', '정상적으로 처리되었습니다.')
      })
      .catch((error) => {
        console.error('Error:', error)
        handleAlert('failure', '문제가 발생했습니다')
      })
      .finally(() => handleData())
  }

  return (
    <Button
      size="sm"
      color="gray"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      onClick={() => handleSubimt()}
    >
      승인
    </Button>
  )
}
