'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Table, Button } from 'flowbite-react'
import { useEffect, useState } from 'react'

export default function AdminOrderDetail({ params: { id } }) {
  const [error, setError] = useState(null)
  const [adminOrderDetail, setAdminOrderDetail] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const adminOrderReqUrl = apiUrl + `/api/manage/order/detail/${id}`
  const [color, setColor] = useState('')
  const [message, setMessage] = useState(false)
  const [state, setState] = useState('')
  const [isApprovalLoading, setIsApprovalLoading] = useState(false)

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleData = () => {
    fetchExtended(adminOrderReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          throw new Error(res['message'])
        } else {
          setAdminOrderDetail(res['data'])
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleApproval = () => {
    setIsApprovalLoading(true) // Set loading state when approval process starts

    const approvalReqBody = adminOrderDetail.map((item) => ({
      productId: item.productId,
      qty: item.reqQty,
      expirationDate: item.expirationDate,
    }))

    fetchExtended(apiUrl + `/api/manage/order/detail/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
      body: JSON.stringify(approvalReqBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          throw new Error(res['message'])
        } else {
          handleAlert('success', '승인되었습니다')
          setState(true)
        }
      })
      .catch((error) => {
        handleAlert('failure', '승인에 실패했습니다')
      })
      .finally(() => {
        setIsLoading(false)
        setIsApprovalLoading(false) // Reset loading state after approval process finishes
      })
  }

  useEffect(() => {
    setIsLoading(false)
    handleData()
  }, [])

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-10">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <div className="flex flex-col items-center pt-16">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="">
            <Table className="text-s w-[calc(100vw-300px)] items-center justify-center text-center">
              <Table.Head className="text-m whitespace-nowrap text-gray-900 dark:text-white">
                <Table.HeadCell>productId</Table.HeadCell>
                <Table.HeadCell>brand</Table.HeadCell>
                <Table.HeadCell>name</Table.HeadCell>
                <Table.HeadCell>price</Table.HeadCell>
                <Table.HeadCell>quantity</Table.HeadCell>
                <Table.HeadCell>expirationDate</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {adminOrderDetail.map((item) => (
                  <Table.Row
                    key={item.productId}
                    className="items-center bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{item.productId}</Table.Cell>
                    <Table.Cell>{item.brand}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.price}</Table.Cell>
                    <Table.Cell>{item.reqQty}</Table.Cell>
                    <Table.Cell>{item.expirationDate}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
        <div className="relative items-center pt-10">
          <Button id="approvalBtn" onClick={handleApproval} disabled={isApprovalLoading || state}>
            {isApprovalLoading ? '처리중...' : '승인'}
          </Button>
        </div>
      </div>
    </div>
  )
}
