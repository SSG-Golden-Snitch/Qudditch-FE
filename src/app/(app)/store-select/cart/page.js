'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'
import { IoMdClose } from 'react-icons/io'

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

  // 세 자리마다 , 표시
  const formatNumber = (number) => {
    if (!number) return '0'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 세자리마다 , 표시 추가
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">장바구니</h2>
      {message && <p>{message}</p>}

      <h3 className="mb-4 border-b-2">결제 상품</h3>

      {cartItems.map((item) => (
        <div key={item.productId} className="flex items-center justify-between border-y-2 py-2">
          <div class="flex items-center">
            <input
              checked
              id="checked-checkbox"
              type="checkbox"
              value=""
              class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </div>
          <img src={item.image} alt={item.name} className="h-20 w-20 object-cover" />
          <span>
            {item.name} - {item.qty}개
          </span>

          <h4>{formatNumber(item.price)}</h4>

          <Button onClick={() => removeItemFromCart(item.productId)}>
            <IoMdClose />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default CartPage
