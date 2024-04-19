'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { TiStarFullOutline } from 'react-icons/ti'

export default function Favorite() {
  const [product, setProduct] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleProduct = () => {
    const reqURL = apiUrl + '/api/bookmark/user/products'
    fetchExtended(reqURL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data['message'] === 'SUCCESS') {
          setProduct(data['bookmarkList'])
          console.log(product)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleRemoveBookmark = async (productId) => {
    console.log(productId)
    await fetchExtended(`/api/bookmark/user/product?productId=` + productId, {
      method: 'DELETE',
    }).then(() => {
      handleProduct()
    })
  }

  useEffect(() => {
    handleProduct()
  }, [])

  function ProductList({ list }) {
    const items = list.map((product, i) => {
      return (
        <li key={i} className="border-a border-gray-100">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <img src={product['productImage']} className="h-12 w-12 " />
              <div className="ml-3">
                <div className="text-sm text-gray-800"></div>
                <div className="text-sm text-gray-800">
                  {product['productBrand']} ) {product['productName']}
                </div>

                <div className="text-xs text-gray-400">{product['productPrice']} 원</div>
              </div>
            </div>
            <div className="flex items-center">
              <TiStarFullOutline
                className={'h-5 w-5 text-amber-200'}
                onClick={() => handleRemoveBookmark(product['productId'])}
              />{' '}
            </div>
          </div>
        </li>
      )
    })
    return <div>{items}</div>
  }

  return (
    <div className="min-h-full bg-gray-100 px-3 pb-3">
      <div className="p-3">
        <div className="py-4">
          <button
            type="button"
            className="flex items-center"
            onClick={() => router.push('/m/setting')}
          >
            <IoIosArrowBack className="mr-2" />
            <h2 className="text-m font-semibold">관심상품</h2>
          </button>
        </div>
        <ul className="rounded-2xl bg-white shadow">
          {/* {isLoading ? <Loading /> : message ? message : <ProductList list={items} />} */}
          <ProductList list={product} />
        </ul>
      </div>
    </div>
  )
}
