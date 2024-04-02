import { Table } from 'flowbite-react'
export async function getOrder(id) {
  const response = await fetch(`http://localhost:8080/api/store/order/detail/${id}`)
  return response.json()
}

export default async function OrderDetailPage({ id }) {
  const order = await getOrder(id)
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell>Brand</Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>quantity</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {order.products.map((product) => (
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={product.id}>
            <Table.Cell>
              <img src={product.image} alt={product.name} width="70" />
            </Table.Cell>
            <Table.Cell>{product.brand}</Table.Cell>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.qty}개</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
