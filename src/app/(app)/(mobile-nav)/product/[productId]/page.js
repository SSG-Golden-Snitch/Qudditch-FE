'use client'

import { useEffect, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import Loading from '@/components/ui/Loading'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Divider } from '@aws-amplify/ui-react'
import { CiStar } from 'react-icons/ci'
import { TiStarFullOutline } from 'react-icons/ti'
import { getDistance } from '@/utils/mapUtil'

const ProductSearchPage = () => {
  const params = useParams()
  const productId = params['productId']
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [stores, setStores] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)

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
    const params = new URLSearchParams(
      currentLocation
        ? {
            currentWgs84X: currentLocation['longitude'],
            currentWgs84Y: currentLocation['latitude'],
          }
        : {},
    )

    fetchExtended(`/api/product/store/${productId}?${params.toString()}`)
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
  }, [currentLocation, productId])

  const priceToWon = (price) => {
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .concat('원')
  }

  return (
    <div className={'h-full w-full overflow-y-scroll'}>
      {loading && <Loading />}
      <div className={'flex flex-row items-center justify-between px-3 py-2 pb-16'}>
        <div className={'flex flex-row items-center'}>
          <div className={'text-2xl'}>←</div>
        </div>
      </div>
      {product && (
        <div className={'flex flex-col items-center'}>
          <Image
            className={'pb-20'}
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
                <TiStarFullOutline className={'h-10 w-10 text-amber-200'} />
              ) : (
                <CiStar className={'h-10 w-10 text-amber-200'} />
              )}
            </div>
            <div className={'py-4'}>
              <Divider size={'small'} />
            </div>
          </div>
          <div className={'w-full'}>
            {stores.map((store, index) => (
              <div key={index}>
                <div className={'flex flex-row items-center justify-between px-5'}>
                  <div>
                    <div className={'text-lg'}>{store['name']}</div>
                    <div className={'text-sm'}>{store['address']}</div>
                  </div>
                  <div>
                    <div className={'text-lg'}>{store['qty'] + '개'}</div>
                    <div className={'text-sm'}>
                      {getDistance(
                        currentLocation['latitude'],
                        currentLocation['longitude'],
                        store['wgs84Y'],
                        store['wgs84X'],
                      ) + 'm'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSearchPage
