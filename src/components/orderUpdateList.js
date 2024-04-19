'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Table } from 'flowbite-react'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { fetchExtended } from '@/utils/fetchExtended'
import { CustomAlert } from '@/components/CustomAlert'
import Loading from '@/components/ui/Loading'

async function searchProductByName(productName) {
  const URL = `/api/product/find/${productName}`
  const response = await fetchExtended(URL)
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
  const [alertMessage, setAlertMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const handleAlert = (message = '') => {
    setAlertMessage(message)
  }

  useEffect(() => {
    const getOrder = async () => {
      const response = await fetchExtended(`/api/store/order/detail/${id}`)
      const data = await response.json()
      setIsLoading(false)
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
      setAlertMessage(`${existingProduct.name}은(는) 이미 주문에 추가된 제품입니다.`)
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

    const response = await fetchExtended(`/api/store/order/detail/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateProducts),
    })

    if (response.ok) {
      setAlertMessage('수정 성공')
      router.push(`/order/detail/${id}`)
    } else {
      setAlertMessage('수정 실패')
    }
  }

  if (!order) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  const removeFromOrder = async (index) => {
    const updatedOrder = { ...order }
    const removedProduct = updatedOrder.products.splice(index, 1)[0]
    setOrder(updatedOrder)

    const response = await fetchExtended(`/api/store/order/detail/update/${id}`, {
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
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className=" h-screen overflow-x-auto px-10 py-10">
          {alertMessage && <CustomAlert message={alertMessage} handleDismiss={handleAlert} />}
          <form
            className="relative mx-auto max-w-md"
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center pl-3">
              <svg className="h-4 w-4 " aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
              placeholder="제품 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <button
              type="submit"
              className="absolute bottom-2.5 right-2.5 rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Search
            </button>
          </form>
          <br />
          <br />
          <Table className="text-center text-black">
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Brand</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {order.products.map((product, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={product.id}
                >
                  <Table.Cell>{product.id}</Table.Cell>
                  <Table.Cell>{product.brand}</Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>
                    <input
                      type="number"
                      value={product.qty || 0}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    />
                  </Table.Cell>
                  <td>
                    <button
                      className=" p-5 text-xl hover:bg-gray-100"
                      onClick={() => removeFromOrder(index)}
                    >
                      <RiDeleteBack2Line />
                    </button>
                  </td>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <br />
          <a
            onClick={updateOrderProducts}
            class="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 p-3 px-4 py-2 font-medium text-gray-600 shadow-md transition duration-300 ease-out"
          >
            <span class="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-gray-500 text-white duration-300 group-hover:translate-x-0">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span class="ease absolute flex h-full w-full transform items-center justify-center text-gray-500 transition-all duration-300 group-hover:translate-x-full">
              발주수정
            </span>
            <span class="invisible relative">발주수정</span>
          </a>
          <br />
          <br />
          <Table>
            <Table.Body className="divide-y">
              {searchResults.map((product) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={product.id}
                >
                  <Table.Cell>
                    <img src={product.image} alt={product.name} width="70" />
                  </Table.Cell>
                  <Table.Cell>{product.brand}</Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>
                    <button
                      type="button"
                      className="mr-2 inline-flex items-center rounded-lg bg-gray-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                      onClick={() => addToOrder(product)}
                    >
                      <svg
                        className="mr-2 h-3.5 w-3.5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 18 21"
                      >
                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                      </svg>
                      +
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  )
}
