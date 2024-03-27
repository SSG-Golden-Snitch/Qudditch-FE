'use client'
import { apiUrl } from '@/utils/fetchExtended'
import { Button, Select, Table, TableHeadCell } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'

async function DownloadBtn(inputId, inputAt) {
  const downloadUrl = `http://localhost:8080/api/store/stock/input/download/${inputId}`

  await fetch(downloadUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      credentials: 'include',
    },
  })
    .then((res) => res.json())
    .then(async (res) => {
      if (res['status'] === 'fail') {
        alert(res['message'])
        // throw new Error(res['message'])
      } else {
        const blob = await fetch(downloadUrl).then((r) => r.blob())
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `입고내역서-${inputAt}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      }
    })
}

async function handleInputClick(storeInputId, quantity, expirated, position, productId) {
  const inputCheckUrl = apiUrl + `/api/store/stock/input/${storeInputId}`
  const inputCheckBody = {
    productId: productId,
    positionId: position,
    qty: quantity,
    expiredAt: expirated,
  }

  await fetch(inputCheckUrl, {
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
        throw new Error(res['message'])
      } else {
        alert('검수가 완료되었습니다.')
        window.location.reload()
      }
    })
    .catch((error) => {
      alert(error.message)
    })
}

export function CustomTable({ data, header, params }) {
  const router = useRouter()
  const [position, setPosition] = useState(0)
  const handleDetailClick = (storeInputId) => {
    router.push(`input/detail/${storeInputId}`)
  }
  const handlePositionChange = (e) => {
    setPosition(e.target.value)
  }
  return (
    <div className=" w-128 px-3">
      <Table className="text-s w-[calc(100vw-300px)] items-center justify-center text-center">
        <Table.Head>
          {header.map((h, index) => (
            <TableHeadCell
              key={index}
              className="text-m whitespace-nowrap text-gray-900 dark:text-white"
            >
              {h.label}
            </TableHeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((item, index) => (
            <Table.Row
              key={index}
              className="items-center bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {header.map((h, subIndex) => (
                <Table.Cell
                  onClick={
                    h.col_name === 'items'
                      ? () => {
                          handleDetailClick(item['storeInputId'])
                        }
                      : null
                  }
                  key={subIndex}
                  className={`relative items-center whitespace-nowrap text-center font-medium text-gray-900 dark:text-white ${
                    h.col_name === 'items' ? 'cursor-pointer hover:underline' : ''
                  }`}
                >
                  {h.col_name === 'inputAt' ? item[h.col_name].split('T')[0] : item[h.col_name]}
                  {h.col_name === 'download' && (
                    <div
                      onClick={() =>
                        DownloadBtn(item['storeInputId'], item['inputAt'].split('T')[0])
                      }
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-blue-700"
                    >
                      <AiOutlineDownload />
                    </div>
                  )}

                  {h.col_name === 'position' && item['state'] !== '검수완료' ? (
                    <Select defaultValue={0} onChange={handlePositionChange}>
                      <option value={0}>선택</option>
                      <option value={1}>A</option>
                      <option value={2}>B</option>
                      <option value={3}>C</option>
                      <option value={4}>D</option>
                      <option value={5}>E</option>
                    </Select>
                  ) : null}

                  {h.col_name === 'position' && item['state'] === '검수완료' ? (
                    <Select value={item['locate']} disabled>
                      <option value={0}>선택</option>
                      <option value={1}>A</option>
                      <option value={2}>B</option>
                      <option value={3}>C</option>
                      <option value={4}>D</option>
                      <option value={5}>E</option>
                    </Select>
                  ) : null}

                  {h.col_name !== 'check' ? null : item['state'] === '검수전' ? (
                    <Button
                      size="sm"
                      color="gray"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      onClick={() => {
                        position === 0
                          ? alert('위치를 선택해주세요')
                          : handleInputClick(
                              params,
                              item['qty'],
                              item['expDate'],
                              position,
                              item['productId'],
                            )
                      }}
                    >
                      검수하기
                    </Button>
                  ) : (
                    <Button
                      disabled
                      size="sm"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      검수완료
                    </Button>
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
