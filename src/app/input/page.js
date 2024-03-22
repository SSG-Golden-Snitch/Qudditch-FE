'use client'

import { CustomTable } from '@/components/customTable'
import { useEffect, useState } from 'react'

export default function Input() {
  const [inputItem, setinputItem] = useState([])

  const handleinputItem = async () => {
    const inputItemReqUrl = new URL('http://localhost:8080/api/store/stock/input')
    inputItemReqUrl.searchParams.append('page', pagination['page'])
    inputItemReqUrl.searchParams.append('recordSize', pagination['recordSize'])

    console.log(pagination['page'])
    console.log(pagination['recordSize'])

    setPagination({ ...pagination, page: pagination['page'] + 1 })

    console.log(pagination['page'])

    await fetch(inputItemReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setinputItem(res['data'])
        setPagination(res['pagination'])
      })
  }
  useEffect(() => {
    handleinputItem()
    handlePagiantion()
  }, [])

  const handlePagiantion = () => {
    setPagination({ ...pagination, page: pagination['page'] + 1 })
  }

  return (
    <div className="h-screen bg-gray-100 p-6 py-16 sm:ml-48">
      <CustomTable
        data={inputItem}
        header={[
          { label: 'items', col_name: 'items' },
          { label: '입고일', col_name: 'inputAt' },
          { label: '검수', col_name: 'state' },
        ]}
      />
    </div>
  )
}
