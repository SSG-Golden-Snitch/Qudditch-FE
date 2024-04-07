'use client'

import React, { useState, useEffect } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { IoMdClose, IoIosArrowBack } from 'react-icons/io'
import CartNavbar from '@/components/CartNavbar'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [totalAmount, setTotalAmount] = useState([])
  const [totalPay, setTotalPay] = useState([])
  const [usedPoints, setUsedPoints] = useState(0) // 사용자가 입력한 포인트
  const [earnPoints, setEarnPoints] = useState(0) // 사용자가 입력한 포인트
  const [remainingPoints, setRemainingPoints] = useState(1000)
  const [message, setMessage] = useState('')
  const [allSelected, setAllSelected] = useState(true)

  // 결제 준비 정보 추가 및 전송 로직
  const preparePaymentInfo = () => {
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      usedPoints, // 각 아이템에 포인트 사용금액 추가
      totalPay, // 총 결제 금액 추가
      earnPoints, // 포인트 적립금액 추가
    }))

    return updatedCartItems
  }

  // 장바구니가 비었는지 확인하는 상태 추가
  const isEmpty = cartItems.length === 0

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
    calculateTotalPay(total, usedPoints)
  }

  const calculateTotalPay = (totalAmount, usedPoints) => {
    const totalPay = totalAmount - usedPoints
    setTotalPay(totalPay)
    calculateEarnPoints(totalPay) // 포인트 적립금액 계산
  }

  const calculateEarnPoints = (totalPay) => {
    const earnPoints = Math.round(totalPay * 0.01)
    setEarnPoints(earnPoints)
  }

  // 포인트 전액 사용 버튼 클릭 이벤트
  const handleUseAllPoints = () => {
    setUsedPoints(Math.min(remainingPoints, totalAmount))
    calculateTotalPay(totalAmount, remainingPoints)
  }

  // 포인트 입력 처리
  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0
    setUsedPoints(Math.min(value, remainingPoints))
    calculateTotalPay(totalAmount, value)
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
    <div className="flex h-screen flex-col justify-between bg-gray-100">
      <div className="fixed left-0 top-0 z-10 flex w-full justify-between bg-white p-4 shadow-md">
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

      <div className="mt-20 justify-between bg-white p-4 shadow-md">
        {/* 장바구니 상품 목록 표시 */}
        {isEmpty ? (
          // 장바구니가 비어있을 때
          <div className="mt-8 text-center">
            <p>장바구니에 담긴 상품이 없습니다.</p>
            <p>오늘의 인기상품 보기 &gt;</p>
          </div>
        ) : (
          // 장바구니에 상품이 담겨있을 때
          <div>
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
                <h3 className="mb-4 border-b-2">결제금액</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="flex justify-between text-left">
                      <td className="w-1/2">총 상품 가격:</td>
                      <td className="w-1/2 text-right">{formatNumber(totalAmount)}원</td>
                    </tr>
                    <tr className="flex justify-between text-left">
                      <td className="w-1/2">포인트 사용금액:</td>
                      <td className="flex w-1/2 items-center justify-end text-right">
                        -
                        <input
                          type="text"
                          value={usedPoints}
                          onChange={handlePointsChange}
                          className="mx-2 w-16 rounded border text-center text-red-500"
                        />
                        P
                      </td>
                    </tr>
                    <tr className="flex justify-between text-left">
                      <td className="w-1/2"></td>
                      <td className="text-s w-1/2 text-right">
                        잔여: {formatNumber(remainingPoints - usedPoints)}P
                      </td>
                      <button onClick={handleUseAllPoints} className="rounded bg-slate-200 py-1">
                        전액 사용
                      </button>
                    </tr>
                    <tr className="flex justify-between text-left">
                      <td className="w-1/2">총 결제 금액:</td>
                      <td className="w-1/2 text-right">{formatNumber(totalPay)}원</td>
                    </tr>
                    <tr className="flex justify-between text-left">
                      <td className="w-1/2">포인트 적립금액:</td>
                      <td className="w-1/2 text-right">{earnPoints}P</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <CartNavbar
        allSelected={allSelected}
        handleSelectAllChange={handleSelectAllChange}
        initiatePayment={preparePaymentInfo}
        totalPay={totalPay}
      />
    </div>
  )
}

export default CartPage
