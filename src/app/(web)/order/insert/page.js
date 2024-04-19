'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { Table } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { CustomAlert } from '@/components/CustomAlert'
import Image from 'next/image'
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

async function insertOrder(products) {
  const URL = '/api/store/order'
  const response = await fetchExtended(URL, {
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
  const URL = '/api/store/recommend'
  const response = await fetchExtended(URL)
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
  const [alertMessage, setAlertMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const handleAlert = (message = '') => {
    setAlertMessage(message)
  }

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const recommended = await recommendOrder()
        setIsLoading(false)
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

    // 이미 추가된 제품인지 확인
    const existingProduct = orderProducts.find((p) => p.id === id)
    if (existingProduct) {
      // 이미 추가된 제품이 있으면 알림 표시
      setAlertMessage(`${existingProduct.name}은(는) 이미 발주 목록에 추가되었습니다.`)
      return
    }

    const newProduct = {
      id,
      brand: product.brand,
      name: product.name,
      image: product.image,
      qty: 1,
    }

    setOrderProducts((current) => {
      const updatedProducts = [...current, newProduct]
      return updatedProducts
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
    if (orderProducts.length === 0) {
      // 제품 목록이 비어 있으면 경고 메시지 표시
      setAlertMessage('발주할 제품이 목록에 없습니다. 제품을 추가해 주세요.')
      return // 함수 실행 중단
    }

    try {
      const productsToOrder = orderProducts.map(({ id, qty }) => ({
        productId: id,
        qty,
      }))
      const result = await insertOrder(productsToOrder)
      router.push('/order')
      console.log('발주 등록 결과:', result)
    } catch (error) {
      console.error('발주 등록 실패:', error)
      setAlertMessage(`발주 등록 실패: ${error.message}`)
    }
  }

  const removeFromOrder = (id) => {
    setOrderProducts((current) => current.filter((product) => product.id !== id))
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="h-screen overflow-x-auto bg-[#e4e4e4] px-10 py-10">
          {alertMessage && <CustomAlert message={alertMessage} handleDismiss={handleAlert} />}
          <form
            className="relative mx-auto max-w-md"
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 20 20"
              >
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
          <Table className="items-center justify-center text-center text-black">
            <Table.Head className="items-center text-black">
              <Table.HeadCell>id</Table.HeadCell>
              <Table.HeadCell>Brand</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y ">
              {orderProducts.map((product) => (
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
                      value={product.qty}
                      onChange={(e) => updateQty(product.id, parseInt(e.target.value, 10))}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className=" p-5 text-xl hover:bg-gray-100"
                      onClick={() => removeFromOrder(product.id)}
                    >
                      <RiDeleteBack2Line />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <br />

          <a
            onClick={handleSubmit}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 p-3 px-4 py-2 font-medium text-gray-600 shadow-md transition duration-300 ease-out"
          >
            <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-gray-500 text-white duration-300 group-hover:translate-x-0">
              <svg
                className="h-6 w-6"
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
            <span className="ease absolute flex h-full w-full transform items-center justify-center text-gray-500 transition-all duration-300 group-hover:translate-x-full">
              발주추가
            </span>
            <span className="invisible relative">발주추가</span>
          </a>

          <br />
          <br />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {searchResults.length > 0 && (
              <div className="md:col-span-1">
                <Table className="mt-12">
                  <Table.Head>
                    <Table.HeadCell>image</Table.HeadCell>
                    <Table.HeadCell>Brand</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {searchResults.map((product) => (
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={product.id}
                      >
                        <Table.Cell>
                          <Image src={product.image} alt={product.name} width="70" height="70" />
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
            {recommend.length > 0 && (
              <div className="md:col-span-1">
                <div className="flex shrink-0">
                  <h1 class="mb-1 text-2xl font-semibold leading-none tracking-tight text-gray-900  md:text-2xl lg:text-2xl">
                    발주{' '}
                    <span class="underline-offset-3 underline decoration-blue-400 decoration-4 ">
                      추천 상품
                    </span>
                  </h1>
                  <p class="text-l lg:text-l ml-3 mt-2 font-normal text-gray-500 dark:text-gray-400">
                    재고가 10개 이하인 제품들의 추천제품 목록입니다.
                  </p>
                </div>
                <Table className="mt-3">
                  <Table.Head>
                    <Table.HeadCell>image</Table.HeadCell>
                    <Table.HeadCell>Brand</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {recommend.map((product, idx) => (
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={idx}
                      >
                        <Table.Cell>
                          <Image src={product.image} alt={product.name} width="70" height="70" />
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
          </div>
        </div>
      )}
    </>
  )
}
