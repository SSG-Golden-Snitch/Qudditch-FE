'use client'

import { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import CustomLoading from '@/components/ui/CustomLoading'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Divider } from '@aws-amplify/ui-react'
import { CiStar } from 'react-icons/ci'
import { TiStarFullOutline } from 'react-icons/ti'
import { getDistance } from '@/utils/mapUtil'
import { IoIosArrowBack, IoIosInformationCircleOutline } from 'react-icons/io'

const ProductSearchPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params['productId']
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  })

  const handleProduct = async () => {
    const params = new URLSearchParams({
      currentWgs84X: currentLocation['longitude'],
      currentWgs84Y: currentLocation['latitude'],
    })
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
  }, [currentLocation, productId])

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
    <div className={'h-[calc(100vh-5rem)] w-full'}>
      {loading && <CustomLoading />}
      <div className={'flex flex-row items-center justify-between px-3 py-2 pb-14'}>
        <div className={'flex flex-row items-center'}>
          <button type="button" className="flex items-center" onClick={() => router.push('/m')}>
            <IoIosArrowBack className="mr-2 mt-2 text-xl" />
          </button>
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
            <p className={'pt-1 text-xs text-gray-400'}>
              ⓘ 재고 수량은 판매 상황 및 구매 시점에 따라 실제 점포 재고와 상이할 수 있습니다.
            </p>
            <div className={'py-3'}>
              <Divider size={'small'} />
            </div>
          </div>
          <div className={'h-[10rem] w-full overflow-y-scroll'}>
            {currentLocation?.latitude === 0 ? (
              <div className={'flex flex-col items-center justify-center'}>
                <div className={'text-lg'}>위치 정보를 가져오는 중입니다.</div>
              </div>
            ) : stores && stores.length > 0 ? (
              stores.map((store, index) => (
                <div
                  key={index}
                  className={'h-[4rem]'}
                  onClick={() => router.push(`/m/map?storeId=${store['id']}`)}
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
              <div className={'flex flex-col items-center justify-center'}>
                <div className={'text-lg'}>주변에 판매하는 매장이 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSearchPage
