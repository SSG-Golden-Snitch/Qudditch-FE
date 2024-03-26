'use cliet'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

async function searchProductByName(productName) {
  const URL = `http://localhost:8080/api/product/find/${productName}`
  const response = await fetch(URL)
  if (!response.ok) {
    throw new Error('제품 검색에 실패했습니다.')
  }
  const result = await response.json()
  return result.data
}

export default function GetDetail({ id }) {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

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

  const handleSearch = async () => {
    try {
      const products = await searchProductByName(searchTerm)
      setSearchResults(products)
    } catch (error) {
      console.error('검색 오류:', error)
    }
  }

  const addToOrder = (product) => {
    const existingProduct = order.products.find((p) => p.id === product.id)
    if (existingProduct) {
      alert(`${existingProduct.name}은(는) 이미 주문에 추가된 제품입니다.`)
      return
    }

    const updatedOrder = { ...order }
    updatedOrder.products.push(product)
    setOrder(updatedOrder)
  }

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...order.products]
    updatedProducts[index].qty = Math.max(newQuantity, 0) // 수량을 0 미만으로 내려가지 않도록 처리
    setOrder({ ...order, products: updatedProducts })
  }

  const updateOrderProducts = async () => {
    const updateProducts = order.products.map(({ id, qty }) => ({
      productId: id,
      qty: qty,
    }))

    const response = await fetch(`http://localhost:8080/api/store/order/detail/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateProducts),
    })

    if (response.ok) {
      alert('수정 성공!!')
      router.push(`/order/detail/${id}`)
    } else {
      alert('수정 실패!!')
    }
  }

  if (!order) {
    return <div>Loading...</div>
  }

  const removeFromOrder = async (index) => {
    const updatedOrder = { ...order }
    const removedProduct = updatedOrder.products.splice(index, 1)[0]
    setOrder(updatedOrder)

    const response = await fetch(`http://localhost:8080/api/store/order/detail/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ productId: removedProduct.id, qty: 0 }]),
    })

    if (!response.ok) {
      console.error('제품 삭제에 실패했습니다.')
      updatedOrder.products.splice(index, 0, removedProduct)
      setOrder(updatedOrder)
    }
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
              <td>
                <button onClick={() => removeFromOrder(index)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>발주 등록</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="제품 이름 검색"
      />
      <button
        className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
        onClick={handleSearch}
      >
        검색
      </button>
      <ul>
        {searchResults.map((product) => (
          <li key={product.id}>
            <div>{product.brand}</div>
            <div>{product.name}</div>
            <img src={product.image} alt={product.name} width="100" />
            <button
              className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => addToOrder(product)}
            >
              추가
            </button>
          </li>
        ))}
      </ul>
      <button onClick={updateOrderProducts}>수정하기</button>
    </div>
  )
}
