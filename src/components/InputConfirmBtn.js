'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Button, Modal, Select, Table, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'

export function inputConfirmBtn(storeInputId, quantity, expirated, position, productId) {
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
        setOpenModal(false)
        handleAlert('success', '검수 완료되었습니다')
      })
      .catch((error) => {
        console.error('Error:', error)
        handleAlert('error', '검수에 실패했습니다')
      })
      .finally(() => handleData())
  }

  return (
    <Button onClick={handleSubimt} size="small" color="primary">
      검수
    </Button>
  )
}
