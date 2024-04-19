import { fetchExtended } from '@/utils/fetchExtended'
import { Table } from 'flowbite-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CustomLoading from './ui/CustomLoading'
export async function getOrder(id) {
  const response = await fetchExtended(`/api/store/order/detail/${id}`)
  return response.json()
}

export default function OrderDetailPage({ id }) {
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const handleOrder = async () => {
    await getOrder(id).then((data) => {
      setIsLoading(false)
      setOrder(data)
    })
  }

  useEffect(() => {
    handleOrder()
  }, [])

  return (
    <>
      {isLoading ? (
        <CustomLoading />
      ) : (
        <Table className="items-center text-black">
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Brand</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>quantity</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {order &&
              order.products.map((product) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={product.id}
                >
                  <Table.Cell>
                    <Image src={product.image} alt={product.name} width="70" height="70" />
                  </Table.Cell>
                  <Table.Cell>{product.brand}</Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.qty}개</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}
    </>
  )
}
