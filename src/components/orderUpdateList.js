'use cliet'
import React, { useState, useEffect } from 'react'

export default function GetDetail({ id }) {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const getOrder = async () => {
      const response = await fetch(`http://localhost:8080/api/store/order/detail/${id}`)
      const data = await response.json()
      setOrder(data)
    }

    if (id) {
      getOrder()
    }
  }, [id])

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...order.products]
    updatedProducts[index].qty = newQuantity
    setOrder({ ...order, products: updatedProducts })
  }

  const updateOrderProducts = async () => {
    const updateProducts = order.products.map(({ id, qty }) => ({
      productId: id,
      qty: qty,
    }))

    const response = await fetch(`http://localhost:8080/api/store/detail/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateProducts),
    })

    if (response.ok) {
      alert('수정성공!!')
    } else {
      alert('수정실패!!')
    }
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, index) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.brand}</td>
              <td>{product.name}</td>
              <td>
                <input
                  type="number"
                  value={product.qty || 0}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={updateOrderProducts}>수정하기</button>
    </div>
  )
}
