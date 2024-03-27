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
        <Table.HeadCell>A</Table.HeadCell>
        <Table.HeadCell>B</Table.HeadCell>
        <Table.HeadCell>C</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          {order.products.map((product) => (
            <Table.Cell key={product.id}>
              <img src={product.image} alt={product.name} width="50" />
              <Table.Cell>{product.brand}</Table.Cell>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>수량 : {product.qty}</Table.Cell>
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Body>
    </Table>
  )
}
