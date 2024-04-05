'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { IoMdClose, IoIosArrowBack } from 'react-icons/io'
import CartNavbar from '@/components/CartNavbar'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [totalAmount, setTotalAmount] = useState([])
  const [usedPoints, setUsedPoints] = useState(0) // 사용자가 입력한 포인트
  const [remainingPoints, setRemainingPoints] = useState(1000)
  const [message, setMessage] = useState('')
  const [allSelected, setAllSelected] = useState(true)

  useEffect(() => {
    // 페이지 로드 시, customerId 장바구니 아이템 조회 (userStoreId, userCustomerId, productId 고려)
    fetchCartItems()
  }, [])

  // 장바구니 조회 API
  const fetchCartItems = async (userCustomerId) => {
    const queryString = new URLSearchParams(userCustomerId).toString()
    const endpoint = `/api/cart?${queryString}`

    try {
      const response = await fetchExtended(endpoint, {
        method: 'GET',
      })
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)

        // dafault: 체크 선택
        const initialSelected = data.reduce((acc, item) => ({ ...acc, [item.productId]: true }), {})
        setSelectedItems(initialSelected)
        calculateTotalAmount(data, initialSelected)
      } else {
        throw new Error('장바구니 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  // 금액: 세 자리마다 , 표시
  const formatNumber = (number) => {
    if (!number) return '0'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 세자리마다 , 표시 추가
  }

  // 개별 상품 체크 여부
  const handleSelectionChange = (productId) => {
    const newSelectedItems = { ...selectedItems, [productId]: !selectedItems[productId] }
    setSelectedItems(newSelectedItems)
    const allSelected = Object.values(newSelectedItems).every(Boolean)
    setAllSelected(allSelected)
    calculateTotalAmount(cartItems, newSelectedItems)
  }

  // 전체 상품 체크 여부
  const handleSelectAllChange = () => {
    const newAllSelected = !allSelected
    const newSelectedItems = Object.fromEntries(
      cartItems.map((item) => [item.productId, newAllSelected]),
    )
    setSelectedItems(newSelectedItems)
    setAllSelected(newAllSelected)
    calculateTotalAmount(cartItems, newSelectedItems)
  }

  // 상품 합계 금액
  const calculateTotalAmount = (items, selected) => {
    const total = items.reduce(
      (acc, item) => acc + (selected[item.productId] ? item.price * item.qty : 0),
      0,
    )
    setTotalAmount(total)
  }

  // 포인트 전액 사용 버튼 클릭 이벤트
  const handleUseAllPoints = () => {
    setUsedPoints(remainingPoints)
  }

  // 포인트 입력 처리
  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0
    setUsedPoints(value > remainingPoints ? remainingPoints : value)
  }

  const removeItemFromCart = async (productId) => {
    try {
      const response = await fetchExtended(`/api/cart?${productId}`, {
        method: 'delete',
      })
      if (response.ok) {
        fetchCartItems()
      } else {
        throw new Error('장바구니 항목 삭제에 실패하였습니다')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="p-4">
        <div className="mb-4 flex items-center">
          <button
            type="button"
            className="mb-4 flex items-center"
            onClick={() => window.history.back()}
          >
            <IoIosArrowBack className="mr-2" />
            <h2 className="text-xl font-bold">장바구니</h2>
          </button>
        </div>
        {message && <p>{message}</p>}

        <h3 className="mb-4 border-b-2">상품 목록</h3>

        {cartItems.map((item) => (
          <div key={item.productId} className="mb-4 rounded-lg border-2 p-4">
            <div class="flex items-center justify-between pb-2">
              <input
                type="checkbox"
                checked={selectedItems[item.productId]}
                onChange={() => handleSelectionChange(item.productId)}
                className="mr-2"
              />
              <img src={item.image} alt={item.name} className="mr-4 h-20 w-20 object-cover" />
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p>
                  {item.qty} 개 {formatNumber(item.price)}원
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeItemFromCart(item.productId)}
                className="mb-10 rounded-lg border border-white bg-white px-1 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 border-t p-4">
          <div className="font-bold">
            <h3 className="mb-4 border-b-2">최종 결제금액</h3>
            <p>총 상품 가격: {formatNumber(totalAmount)}원</p>
            <div className="flex items-center text-red-500">
              <p>포인트 사용금액: -</p>
              <input
                type="text"
                value={usedPoints}
                onChange={handlePointsChange}
                className="mx-2 w-20 rounded border text-center"
              />
              원
              <button
                onClick={handleUseAllPoints}
                className="ml-2 rounded bg-blue-500 px-2 text-white"
              >
                전액 사용
              </button>
            </div>
            <p>총 결제 금액: 원</p>
            <p>포인트 적립금액: </p>
          </div>
        </div>
      </div>

      <CartNavbar
        allSelected={allSelected}
        handleSelectAllChange={handleSelectAllChange}
        totalAmount={formatNumber(totalAmount)}
      />
    </div>
  )
}

export default CartPage
