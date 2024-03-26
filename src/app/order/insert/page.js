'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

async function searchProductByName(productName) {
  const URL = `http://localhost:8080/api/product/find/${productName}`
  const response = await fetch(URL)
  if (!response.ok) {
    throw new Error('제품 검색에 실패했습니다.')
  }
  const result = await response.json()
  return result.data
}

async function insertOrder(products) {
  const URL = 'http://localhost:8080/api/store/order'
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products),
  })

  if (!response.ok) {
    // 여기서 오류 처리
    const text = await response.text() // 응답을 텍스트로 받기
    throw new Error(`발주 등록 실패: ${text}`)
  }

  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  } else {
    // JSON이 아니면 텍스트 메시지로 처리
    const text = await response.text()
    console.log(text) // 텍스트 응답을 콘솔에 출력
    return text // 텍스트 응답을 반환
  }
}

async function recommendOrder() {
  const URL = 'http://localhost:8080/api/store/recommend'
  const response = await fetch(URL)
  if (!response.ok) {
    throw new Error('추천목록 불러오기 실패')
  }
  const result = await response.json()
  return result.list
}

export default function OrderInsertPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [orderProducts, setOrderProducts] = useState([])
  const [recommend, setRecommend] = useState([])

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const recommended = await recommendOrder()
        setRecommend(recommended)
      } catch (error) {
        console.error('추천 목록 불러오기 실패:', error)
      }
    }
    fetchRecommend()
  }, [])

  const handleSearch = async () => {
    try {
      const products = await searchProductByName(searchTerm)
      setSearchResults(products)
    } catch (error) {
      console.error('검색 오류:', error)
    }
  }

  const addToOrder = (product) => {
    const id = product.productId || product.id

    const newProduct = {
      id,
      brand: product.brand,
      name: product.name,
      image: product.image,
      qty: 1, // 추천 목록에서 추가 시 qty를 무조건 1로 설정
    }

    setOrderProducts((current) => {
      const existingProductIndex = current.findIndex((p) => p.id === id)
      if (existingProductIndex >= 0) {
        // 이미 목록에 있는 상품의 경우 수량을 1 증가
        const updatedProducts = [...current]
        updatedProducts[existingProductIndex].qty += 1 // 수량 증가
        return updatedProducts
      } else {
        // 새 상품 추가
        return [...current, newProduct]
      }
    })
  }

  const updateQty = (id, qty) => {
    setOrderProducts((current) =>
      current.map((p) => {
        if (p.id === id) {
          // 수량이 0보다 작으면 0으로 설정
          return { ...p, qty: Math.max(qty, 0) }
        }
        return p
      }),
    )
  }

  const handleSubmit = async () => {
    try {
      const productsToOrder = orderProducts.map(({ id, qty }) => ({
        productId: id,
        qty,
      }))
      alert('발주가 성공적으로 등록되었습니다 !')
      router.push('/order')
      const result = await insertOrder(productsToOrder)
      console.log('발주 등록 결과:', result)
    } catch (error) {
      console.error('발주 등록 실패:', error)
    }
  }

  return (
    <div>
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
      <h2>발주 목록</h2>
      <table>
        <thead>
          <tr>
            <th>브랜드</th>
            <th>제품명</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {orderProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.brand}</td>
              <td>{product.name}</td>
              <td>
                <input
                  type="number"
                  value={product.qty}
                  onChange={(e) => updateQty(product.id, parseInt(e.target.value, 10))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>브랜드</th>
            <th>제품명</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {recommend.map((product) => (
            <tr key={product.id}>
              <td>{product.brand}</td>
              <td>{product.name}</td>
              <td>
                <button onClick={() => addToOrder(product)}>추가</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100"
        onClick={handleSubmit}
      >
        발주 등록
      </button>
    </div>
  )
}
