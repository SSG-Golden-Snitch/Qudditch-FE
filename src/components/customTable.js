'use client'
import { Button, Select, Table, TableHeadCell } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DownloadBtn } from './DownloadBtn'
import { InputConfirmBtn } from './InputConfirmBtn'
import { StockEditBtn } from './StockEditBtn'

export function CustomTable({ data, header, params, handleAlert, handleData }) {
  const router = useRouter()
  const [position, setPosition] = useState(0)

  const handleDetailClick = (storeInputId) => {
    router.push(`input/detail/${storeInputId}`)
  }

  const orderDetailClick = (storeOrderId) => {
    router.push(`manager/detail/${storeOrderId}`)
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
                      : h.col_name === 'orderItems'
                        ? () => {
                            orderDetailClick(item['id'])
                          }
                        : null
                  }
                  key={subIndex}
                  className={`relative items-center whitespace-nowrap text-center font-medium text-gray-900 dark:text-white ${
                    h.col_name === 'items' || h.col_name === 'orderItems'
                      ? 'cursor-pointer hover:underline'
                      : ''
                  }`}
                >
                  {h.col_name === 'inputAt' || h.col_name === 'orderedAt'
                    ? item[h.col_name].split('T')[0]
                    : item[h.col_name]}

                  {h.col_name === 'download' && (
                    <DownloadBtn
                      inputId={item['storeInputId']}
                      inputAt={item['inputAt'].split('T')[0]}
                      handleAlert={handleAlert}
                      handleData={handleData}
                    />
                  )}

                  {h.col_name === 'edit' && (
                    <StockEditBtn item={item} handleAlert={handleAlert} handleData={handleData} />
                  )}

                  {h.col_name === 'position' && (
                    <Select
                      value={item['state'] === '검수완료' ? item['locate'] : undefined}
                      defaultValue={item['state'] !== '검수완료' ? 0 : undefined}
                      onChange={handlePositionChange}
                      disabled={item['state'] === '검수완료'}
                    >
                      <option value={0}>선택</option>
                      <option value={1}>A</option>
                      <option value={2}>B</option>
                      <option value={3}>C</option>
                      <option value={4}>D</option>
                      <option value={5}>E</option>
                    </Select>
                  )}

                  {h.col_name !== 'check' ? null : item['state'] === '검수전' ? (
                    <InputConfirmBtn
                      storeInputId={params}
                      quantity={item['qty']}
                      expirated={item['expDate']}
                      position={position}
                      productId={item['productId']}
                      handleAlert={handleAlert}
                      handleData={handleData}
                    />
                  ) : (
                    <Button
                      disabled
                      size="sm"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      등록완료
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
