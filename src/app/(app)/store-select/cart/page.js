'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [userStoreId, setUserStoreId] = useState([])
  const [productId, setProductId] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 페이지 로드 시, customerId 장바구니 아이템 조회 (userStoreId, userCustomerId, productId 고려)
    fetchCartItems()
  }, [])

  const params = {
    userStoreId: userStoreId,
    productId: productId,
  }

  const fetchCartItems = async () => {
    // 장바구니 조회 API
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/api/cart/items?${queryString}`

    const response = await fetchExtended(endpoint, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()
      setCartItems(data)
    } else {
      setMessage('품목 정보를 불러오는 데 실패하였습니다')
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
    </div>
  )
}

export default CartPage
