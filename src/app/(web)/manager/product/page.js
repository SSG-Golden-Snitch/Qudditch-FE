'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { CustomTable } from '@/components/CustomTable'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Loading from '@/components/ui/Loading'

export default function Product() {
  const [pagination, setPagination] = useState({
    paginationParam: {
      page: 1,
      keyword: "''",
    },
    totalPageCount: 0,
    startPage: 0,
    endPage: 0,
    existPrev: false,
    existNext: false,
  })
  const [product, setProduct] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleProduct = async (page = 1) => {
    setError(null)
    setIsLoading(true)

    const storeReqUrl = new URL(apiUrl + `/api/manage/product?page=${page}`)

    await fetchExtended(storeReqUrl, {
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
          setError(res['message'])
          throw new Error(res['message'])
        } else {
          setProduct(res['data'])
          setPagination(res['pagination'])
          console.log(res)
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handleProduct()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page },
    })
    handleProduct(page)
  }

  if (isLoading) return <Loading />
  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-5">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <div className="flex flex-col items-center pt-10">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <Table className="text-s w-[calc(100vw-300px)] items-center justify-center text-center">
              <Table.Head className="text-m whitespace-nowrap text-gray-900 dark:text-white">
                <Table.HeadCell>id</Table.HeadCell>
                <Table.HeadCell>image</Table.HeadCell>
                <Table.HeadCell>brand</Table.HeadCell>
                <Table.HeadCell>name</Table.HeadCell>
                <Table.HeadCell>price</Table.HeadCell>
                <Table.HeadCell>unitPrice</Table.HeadCell>
                <Table.HeadCell>expiration</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {product.map((item) => (
                  <Table.Row
                    key={item.id}
                    className="items-center bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex justify-center">
                        <Image src={item.image} alt={item.name} width={100} height={100} />
                      </div>
                    </Table.Cell>
                    <Table.Cell>{item.brand}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.price}</Table.Cell>
                    <Table.Cell>{item.unitPrice}</Table.Cell>
                    <Table.Cell>{item.expirationDate}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="relative items-center justify-center pt-10">
              <Pagination
                currentPage={pagination.paginationParam.page}
                totalPages={pagination.totalPageCount}
                showIcons={true}
                onPageChange={(page) => handlePage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
