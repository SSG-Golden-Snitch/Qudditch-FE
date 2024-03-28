'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'

export function InputConfirmBtn({
  storeInputId,
  quantity,
  expirated,
  position,
  productId,
  handleAlert,
  handleData,
}) {
  const inputCheckUrl = apiUrl + `/api/store/stock/input/${storeInputId}`
  const inputCheckBody = {
    productId: productId,
    positionId: position,
    qty: quantity,
    expiredAt: expirated,
  }

  const handleSubimt = () => {
    fetchExtended(inputCheckUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
      body: JSON.stringify(inputCheckBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          alert(res['message'])
        }
        handleAlert('success', '재고가 등록되었습니다.')
      })
      .catch((error) => {
        console.error('Error:', error)
        handleAlert('failure', '재고등록에 실패했습니다')
      })
      .finally(() => handleData())
  }

  return (
    <Button
      size="sm"
      color="gray"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      onClick={() => {
        position === 0 ? handleAlert('warning', '위치를 선택해주세요') : handleSubimt()
      }}
    >
      재고등록
    </Button>
  )
}
