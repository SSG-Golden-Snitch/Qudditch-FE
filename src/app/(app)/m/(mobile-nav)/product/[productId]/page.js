'use client'

import { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import Loading from '@/components/ui/Loading'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Divider } from '@aws-amplify/ui-react'
import { CiStar } from 'react-icons/ci'
import { TiStarFullOutline } from 'react-icons/ti'
import { getDistance } from '@/utils/mapUtil'

const ProductSearchPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params['productId']
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)

  const handleProduct = async () => {
    const params = new URLSearchParams(
      currentLocation
        ? {
            currentWgs84X: currentLocation['longitude'],
            currentWgs84Y: currentLocation['latitude'],
          }
        : {
            currentWgs84X: 0,
            currentWgs84Y: 0,
          },
    )
    await fetchExtended(`/api/product/store/${productId}?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data['productDetail'])
        setStores(data['data'])
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    }
  }, [])

  useEffect(() => {
    handleProduct()
  }, [productId])

  const priceToWon = (price) => {
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .concat('원')
  }

  const handleAddBookmark = async () => {
    await fetchExtended(`/api/bookmark/user/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
      }),
    }).then(() => {
      handleProduct()
    })
  }

  const handleRemoveBookmark = async () => {
    await fetchExtended(`/api/bookmark/user/product?productId=` + productId, {
      method: 'DELETE',
    }).then(() => {
      handleProduct()
    })
  }

  return (
    <div className={'h-[calc(100vh-4rem)] w-full'}>
      {loading && <Loading />}
      <div className={'flex flex-row items-center justify-between px-3 py-2 pb-14'}>
        <div className={'flex flex-row items-center'}>
          <div className={'text-2xl'}>←</div>
        </div>
      </div>
      {product && (
        <div className={'flex flex-col items-center'}>
          <Image
            className={'pb-16'}
            src={product['image']}
            alt={product['name']}
            width={'300'}
            height={'200'}
          />
          <div className={'w-full px-5'}>
            <div className={'flex flex-row items-center justify-between'}>
              <div>
                <div className={'py-1 text-xl'}>{product['brand'] + ')' + product['name']}</div>
                <div className={'text-lg'}>{priceToWon(product['price'])}</div>
              </div>
              {product['bookmark'] ? (
                <TiStarFullOutline
                  className={'h-8 w-8 text-amber-200'}
                  onClick={handleRemoveBookmark}
                />
              ) : (
                <CiStar className={'h-8 w-8 text-amber-200'} onClick={handleAddBookmark} />
              )}
            </div>
            <div className={'py-4'}>
              <Divider size={'small'} />
            </div>
          </div>
          <div className={'h-[13rem] w-full overflow-y-scroll'}>
            {stores ? (
              stores.map((store, index) => (
                <div
                  key={index}
                  className={'h-[4rem]'}
                  onClick={() => router.push(`/m/map/inventory/${store['id']}`)}
                >
                  <div className={'flex flex-row items-center justify-between px-5'}>
                    <div className={'text-left'}>
                      <div className={'text-lg'}>{store['name']}</div>
                      <div className={'text-sm'}>{store['address']}</div>
                    </div>
                    <div className={'text-right'}>
                      <div className={'text-lg'}>{store['qty'] + '개'}</div>
                      <div className={'text-sm'}>
                        {currentLocation &&
                          getDistance(
                            currentLocation['latitude'],
                            currentLocation['longitude'],
                            store['wgs84Y'],
                            store['wgs84X'],
                          ) + 'm'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={'text-center'}>검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSearchPage
