'use client'

import { Table, TableHeadCell } from 'flowbite-react'

export function CustomTable({ data, header }) {
  return (
    <div>
      <Table className="w-full items-center justify-center text-center text-xs">
        <Table.Head>
          {header.map((h, index) => {
            return (
              <TableHeadCell
                key={index}
                className="text-m whitespace-nowrap  text-gray-900 dark:text-white"
              >
                {h['label']}
              </TableHeadCell>
            )
          })}
        </Table.Head>
        <Table.Body className="divide-y ">
          {data.map((d, index) => {
            return (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                {header.map((h, index) => {
                  return (
                    <Table.Cell
                      key={index}
                      className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                    >
                      {d[h['col_name']]}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}
