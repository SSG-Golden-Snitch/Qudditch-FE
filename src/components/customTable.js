'use client'
import { Table, TableHeadCell } from 'flowbite-react'
import { AiOutlineDownload } from 'react-icons/ai'

export function CustomTable({ data, header }) {
  return (
    <div className=" w-128 px-3">
      <Table className="w-[calc(100vw-200px)] items-center justify-center text-center text-xs">
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
                  {h.col_name === 'download' && ( // 다운로드 컬럼에 대한 조건 추가
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
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
