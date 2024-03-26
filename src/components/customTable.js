'use client'
import { Table, TableHeadCell } from 'flowbite-react'
import { AiOutlineDownload } from 'react-icons/ai'

async function DownloadBtn(inputId) {
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
    .then((res) => {
      if (res['status'] === 'fail') {
        throw new Error(res['message'])
      } else {
        alert(res['message'])
      }
    })
}

export function CustomTable({ data, header }) {
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
                  key={subIndex}
                  className="items-cetner whitespace-nowrap text-center font-medium text-gray-900 dark:text-white"
                  style={{ position: 'relative' }} // 아이콘 위치 지정
                >
                  {h.col_name === 'inputAt' ? d[h.col_name].split('T')[0] : d[h.col_name]}
                  {h.col_name === 'download' && (
                    <div
                      onClick={() => DownloadBtn(d['storeInputId'])}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-blue-700"
                    >
                      <AiOutlineDownload />
                    </div>
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
