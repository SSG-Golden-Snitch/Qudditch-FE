'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function OrderList({ id, state, orderedAt }) {
  const router = useRouter()

  const detailClick = () => {
    router.push(`/order/detail/${id}`)
  }

  return (
    <tr className="cursor-pointer" onClick={detailClick}>
      <td>{id}</td>
      <td>{state}</td>
      <td>{orderedAt}</td>
    </tr>
  )
}
