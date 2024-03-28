'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Button, Modal, Select, Table, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'

export function StockEditBtn({ item, handleAlert, handleData }) {
  const updateUrl = apiUrl + `/api/store/stock/update`
  const [openModal, setOpenModal] = useState(false)
  const [quantity, setQuantity] = useState(item['qty'])
  const [position, setPosition] = useState(item['positionId'])
  const [originalQuantity, setOriginalQuantity] = useState(item['qty'])
  const [originalPosition, setOriginalPosition] = useState(item['positionId'])

  const handleSubmit = () => {
    fetchExtended(updateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
      body: JSON.stringify({
        storeStockId: item['id'],
        productId: item['productId'],
        positionId: position,
        quantity: quantity,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          alert(res['message'])
        }
        setOpenModal(false)
        handleAlert('success', '수정되었습니다')
      })
      .catch((error) => {
        console.error('Error:', error)
        handleAlert('error', '수정에 실패했습니다')
      })
      .finally(() => handleData())
  }
  useEffect(() => {
    if (!openModal) {
      setQuantity(originalQuantity)
      setPosition(originalPosition)
    }
  }, [openModal, originalQuantity, originalPosition])

  const handleQtyChange = (value) => {
    setQuantity(value)
  }

  const handlePositionChange = (value) => {
    setPosition(value)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <>
      <Button
        size="sm"
        color="gray"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={() => setOpenModal(true)}
      >
        Edit
      </Button>
      <Modal show={openModal} size={'4xl'} onClose={handleCloseModal}>
        <Modal.Header />
        <Modal.Body>
          <Table className=" items-center justify-center text-center">
            <Table.Head>
              <Table.HeadCell>brand</Table.HeadCell>
              <Table.HeadCell>name</Table.HeadCell>
              <Table.HeadCell>price</Table.HeadCell>
              <Table.HeadCell>quantity</Table.HeadCell>
              <Table.HeadCell>position</Table.HeadCell>
              <Table.HeadCell>expired</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{item['brand']}</Table.Cell>
                <Table.Cell>{item['productName']}</Table.Cell>
                <Table.Cell>{item['productPrice']}</Table.Cell>
                <Table.Cell>
                  <TextInput
                    size="sm"
                    type="number"
                    className="w-24"
                    min={0}
                    value={quantity}
                    onChange={(e) => handleQtyChange(e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Select
                    defaultValue={position}
                    onChange={(e) => handlePositionChange(e.target.value)}
                  >
                    <option value={1}>A</option>
                    <option value={2}>B</option>
                    <option value={3}>C</option>
                    <option value={4}>D</option>
                    <option value={5}>E</option>
                  </Select>
                </Table.Cell>
                <Table.Cell>{item['expiredAt']}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Body>
        <Modal.Footer className=" items-center justify-center text-center">
          <Button size="sm" onClick={handleSubmit}>
            완료
          </Button>
          <Button size="sm" color="gray" onClick={handleCloseModal}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
