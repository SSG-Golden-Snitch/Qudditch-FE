'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  // const [userStoreId, setUserStoreId] = useState([])
  // const [productId, setProductId] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 페이지 로드 시, customerId 장바구니 아이템 조회 (userStoreId, userCustomerId, productId 고려)
    fetchCartItems()
  }, [])

  // 장바구니 조회 API
  const fetchCartItems = async (userCustomerId) => {
    // const params = {
    //   storeId: storeId,
    //   productId: productId,
    // }

    const queryString = new URLSearchParams(userCustomerId).toString()
    const endpoint = `/api/cart?${queryString}`

    try {
      const response = await fetchExtended(endpoint, {
        method: 'GET',
      })
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      } else {
        throw new Error('장바구니 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">장바구니</h2>
      {message && <p>{message}</p>}
      {cartItems.map((item) => (
        <div key={item.productId}>
          <span>
            {item.name} - {item.qty}개
          </span>
          {/* 추가 버튼 예시 (상품 ID는 예시로 넣은 것입니다.) */}
          <Button onClick={() => cartItems(item.productId)}>장바구니에 추가</Button>
        </div>
      ))}
    </div>
  )
}

export default CartPage
