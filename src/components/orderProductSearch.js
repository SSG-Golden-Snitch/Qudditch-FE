'use client'
import React, { useState, useEffect } from 'react'

export default function ProductSearch({ setProducts }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleSearch = async () => {
    const URL = `http://localhost:8080/api/store/order?query=${searchTerm}`
    const response = await fetch(URL)
    const data = await response.json()
    setSearchResults(data)
  }

  const handleAddProduct = (product, qty) => {
    setSelectedProducts((prevProducts) => [...prevProducts, { productId: product.id, qty }])
  }

  // 상위 컴포넌트에 선택된 제품 데이터 전달
  useEffect(() => {
    setProducts(selectedProducts)
  }, [selectedProducts, setProducts])

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>검색</button>
      <ul>
        {searchResults.map((product) => (
          <li key={product.id}>
            {product.name}
            <input
              type="number"
              defaultValue={1}
              onChange={(e) => handleAddProduct(product, Number(e.target.value))}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
