"use client";

import { Table, TableHeadCell, Pagination } from "flowbite-react";
import { useState } from "react";

export function CustomTable({ data, pagination, header }) {
  return (
    <div>
      <Table className="w-full items-center justify-center text-center text-xs">
        <Table.Head>
          <TableHeadCell className="whitespace-nowrap text-m text-gray-900 dark:text-white">No</TableHeadCell>
          {header.map((h, index) => {
            return (
              <TableHeadCell key={index} className="whitespace-nowrap text-m  text-gray-900 dark:text-white">
                {h["label"]}
              </TableHeadCell>
            );
          })}
        </Table.Head>
        <Table.Body className="divide-y ">
          {data.map((d, index) => {
            return (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </Table.Cell>
                {header.map((h, index) => {
                  return (
                    <Table.Cell key={index} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {d[h["col_name"]]}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
