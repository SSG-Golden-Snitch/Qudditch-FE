'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Table } from 'flowbite-react'

export default function OrderList({ id, state, orderedAt }) {
  const router = useRouter()

  const detailClick = () => {
    router.push(`/order/detail/${id}`)
  }

  return (
    <Table.Row
      className="bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
      onClick={detailClick}
    >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{state}</Table.Cell>
      <Table.Cell>{orderedAt}</Table.Cell>
    </Table.Row>
  )
}
