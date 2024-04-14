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
  const [remainingPoints, setRemainingPoints] = useState(0) // 실제 적립액 으로 변경하기
  const [message, setMessage] = useState('')
  const [allSelected, setAllSelected] = useState(true)

  const router = useRouter()
  const { pg_token } = router.query // URL에서 pg_token 추출

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
    console.log(cartItems)
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

  // 수량 업데이트 함수
  const updateItemQty = async (productId, newQty) => {
    console.log(`Updating quantity for product ${productId} to ${newQty}`) // 로그 추가
    try {
      const response = await fetchExtended(`/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, qty: newQty }),
      })

      if (response.ok) {
        console.log('Quantity update successful') // 성공 로그
        fetchCartItems() // 수량 업데이트 후 장바구니 목록 다시 불러오기
      } else {
        const errorData = await response.json()
        console.error('Quantity update failed:', errorData) // 실패 로그
        throw new Error('수량 업데이트 실패: ' + errorData.message)
      }
    } catch (error) {
      console.error('Error updating item quantity:', error)
      setMessage(`Update failed for product ID ${productId}: ${error.message}`)
    }
  }

  const removeItemFromCart = async (productId) => {
    try {
      // DELETE 메소드와 함께 productId를 URL 경로의 일부로 포함하여 요청
      const response = await fetchExtended(`/api/cart/${productId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        // 요청 성공 처리
        fetchCartItems() // 장바구니 목록을 다시 가져옴
      } else {
        // 요청 실패 처리
        throw new Error('장바구니 항목 삭제에 실패하였습니다.')
      }
    } catch (error) {
      // 에러 처리
      console.error('Error:', error)
    }
  }

  // 결제 후 리다이렉션
  useEffect(() => {
    // pg_token이 있는 경우, 결제 승인 요청을 수행
    if (pg_token) {
      approvePayment(pg_token)
    }
  }, [pg_token])

  const approvePayment = async (pg_token) => {
    try {
      const response = await fetchExtended('/api/payment/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pg_token }),
      })
      const data = await response.json()

      if (response.ok) {
        router.push('/payment/success') // 결제 성공 페이지로 리다이렉션
      } else {
        console.error('Failed to approve payment:', data)
        router.push('/payment/fail') // 결제 실패 페이지로 리다이렉션
      }
    } catch (error) {
      console.error('Error approving payment:', error)
      router.push('/payment/fail') // 결제 실패 페이지로 리다이렉션
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
                <div className="flex items-center justify-between pb-2">
                  <input
                    type="checkbox"
                    checked={selectedItems[item.productId]}
                    onChange={() => handleSelectionChange(item.productId)}
                    className="mr-2"
                  />
                  <img src={item.image} alt={item.name} className="mr-4 h-20 w-20 object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                    </div>
                    <div>
                      <select
                        value={item.qty}
                        onChange={(e) => updateItemQty(item.productId, parseInt(e.target.value))}
                        className="h-10 rounded border text-center"
                      >
                        <p>{formatNumber(item.price)}원</p>
                        {Array.from({ length: item.maxQty }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeItemFromCart(item.productId)}
                      className="mb-10 rounded-lg border border-white bg-white p-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      <IoMdClose />
                    </button>
                  </div>
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
                      <td className="w-1/2 text-right">
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
                    <tr className="mb-2 flex items-center justify-between text-left">
                      <td className="w-1/2"></td>
                      <td className="w-1/2 text-right text-xs">
                        잔여: {formatNumber(remainingPoints - usedPoints)}P
                        <button
                          onClick={handleUseAllPoints}
                          className="ml-1 rounded bg-slate-200 px-3 py-1 text-xs"
                        >
                          전액 사용
                        </button>
                      </td>
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
