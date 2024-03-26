'use client'
import { Table, TableHeadCell, Button } from 'flowbite-react'
import { AiOutlineDownload } from 'react-icons/ai'
import { useRouter } from 'next/navigation'

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
        throw new Error(res['message'])
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

export function CustomTable({ data, header }) {
  const router = useRouter()
  const handleDetailClick = (storeInputId) => {
    router.push(`input/detail/${storeInputId}`)
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
          {data.map((d, index) => (
            <Table.Row
              key={index}
              className="items-center bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {header.map((h, subIndex) => (
                <Table.Cell
                  onClick={
                    h.col_name === 'items'
                      ? () => {
                          handleDetailClick(d['storeInputId'])
                        }
                      : null
                  }
                  key={subIndex}
                  className={`items-center whitespace-nowrap text-center font-medium text-gray-900 dark:text-white ${
                    h.col_name === 'items' ? 'cursor-pointer hover:underline' : ''
                  }`}
                  style={{ position: 'relative' }}
                >
                  {h.col_name === 'inputAt' ? d[h.col_name].split('T')[0] : d[h.col_name]}
                  {h.col_name === 'download' && (
                    <div
                      onClick={() => DownloadBtn(d['storeInputId'], d['inputAt'].split('T')[0])}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-blue-700"
                    >
                      <AiOutlineDownload />
                    </div>
                  )}
                  {h.col_name === 'position' && (
                    <select>
                      <option value="1">A</option>
                      <option value="2">B</option>
                      <option value="3">C</option>
                      <option value="4">D</option>
                      <option value="5">E</option>
                    </select>
                  )}
                  {h.col_name !== 'check' ? null : d['state'] === '검수전' ? (
                    <Button size="sm" variant="primary">
                      검수하기
                    </Button>
                  ) : (
                    <Button disabled>검수완료</Button>
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
