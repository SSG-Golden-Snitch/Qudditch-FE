export async function getOrder(id) {
  const response = await fetch(`http://localhost:8080/api/store/order/detail/${id}`)
  return response.json()
}

export default async function OrderDetailPage({ id }) {
  const order = await getOrder(id)
  return (
    <div>
      <h1>Order Detail: {order.storeOrder.id}</h1>
      <div>State: {order.storeOrder.state}</div>
      <div>Ordered At: {order.storeOrder.orderedAt}</div>
      <ul>
        {order.products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.name} width="150" />
            <div>{product.brand}</div>
            <div>{product.name}</div>
            <div>수량 : {product.qty}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
