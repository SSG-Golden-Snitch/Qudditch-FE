'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { Flex } from '@aws-amplify/ui-react'

import { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'

import { Autocomplete, Loader, View } from '@aws-amplify/ui-react'
import Image from 'next/image'

import { useTheme } from '@aws-amplify/ui-react'

export async function getData(id) {
  const response = await fetchExtended(`/api/store/location/stock?userStoreId=${id}`)
  return response.json()
}

export default function LocationStockPage({ id }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { tokens } = useTheme()

  const searchProduct = async (keyword) =>
    fetchExtended('/api/product/find/' + id + '/' + keyword.trim())
      .then((res) => res.json())
      .then((data) => {
        if (data['status'] === 'success') {
          return data['data'].reduce((acc, item) => {
            acc.push({
              label: item.name,
              id: item.id,
              brand: item.brand,
              name: item.name,
              image: item.image,
            })
            return acc
          }, [])
        } else return []
      })
      .catch((err) => {
        setProducts(['검색 결과가 없습니다.'])
        setIsLoading(false)
      })

  const onChange = (event) => {
    setIsLoading(true)
    searchProduct(event.target.value)
      .then((items) => {
        setProducts(items)
        console.log(products)
      })
      .then(() => setIsLoading(false))
  }

  const onSelect = (option) => {
    return
  }

  const onClear = () => {
    setProducts([])
  }

  const renderOption = (option, value) => {
    const { id, brand, name, image } = option
    return (
      <Flex alignItems="center">
        <Image src={image} alt={name} width="60" height="60" />
        <p>{name}</p>
      </Flex>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(id)
      setData(data)
      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data || !data.list || data.list.length === 0) {
    return (
      <div className="bg-white p-4">
        <div className="mb-6 flex items-center">
          <IoIosArrowBack
            className="mr-2 cursor-pointer text-lg"
            onClick={() => window.history.back()}
          />
        </div>
        <div className="text-center">해당 스토어에는 재고가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4">
      <div className="mb-6 flex items-center">
        <IoIosArrowBack
          className="mr-2 cursor-pointer text-lg"
          onClick={() => window.history.back()}
        />
        <Autocomplete
          label="상품 검색"
          options={products}
          placeholder="상품명을 입력해주세요"
          size="medium"
          isLoading={isLoading}
          onChange={onChange}
          onClear={onClear}
          onSelect={onSelect}
          renderOption={renderOption}
          menuSlots={{
            Empty: <View>찾으시는 상품이 존재하지 않습니다</View>,
            LoadingIndicator: (
              <Flex alignItems="center" gap="0.25rem">
                <Loader emptyColor={tokens.colors.black} filledColor={tokens.colors.orange[40]} />
                잠시만 기다려주세요...
              </Flex>
            ),
          }}
        />
      </div>
      <div className="grid gap-4 overflow-y-auto" style={{ maxHeight: '650px' }}>
        {data.list.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-md border p-4">
            <img
              className="mr-4 h-16 w-16 rounded object-cover"
              src={product.productImage}
              alt={product.productName}
            />
            <div className="flex-grow">
              <div className="text-sm font-medium">{product.brand}</div>
              <div className="text-sm">{product.productName}</div>
              <div className="text-sm">{product.productPrice.toLocaleString()}원</div>
            </div>
            <div className="text-sm font-semibold">{product.qty}개</div>
          </div>
        ))}
      </div>
    </div>
  )
}
