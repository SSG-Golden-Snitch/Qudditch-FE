'use client'
import { fetchExtended } from '@/utils/fetchExtended'
import { Autocomplete, Flex, Loader, View, useTheme } from '@aws-amplify/ui-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiFillBell } from 'react-icons/ai'
import AppLogo from '/public/AppLogo.svg'
import BubbleSearch from '/public/BubbleSearch.svg'
import FaceId from '/public/FaceID.svg'
import SmallShop from '/public/SmallShop.svg'
import ProductRank from './ProductRank'
import { VscBellDot } from 'react-icons/vsc'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'

const carouselData = ['/1.png', '/2.png', '/3.png', '/4.png', '/5.png']

const ProductSearchBar = () => {
  const router = useRouter()
  const { tokens } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])

  const searchProduct = async (keyword) =>
    fetchExtended('/api/product/find/' + keyword.trim())
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
    router.push(`/m/product/${option['id']}`)
  }

  const onClear = () => {
    setProducts([])
  }

  const renderOption = (option) => {
    const { name, image } = option
    return (
      <Flex alignItems="center">
        <Image src={image} alt={name} width="60" height="60" />
        <p>{name}</p>
      </Flex>
    )
  }

  return (
    <Autocomplete
      label="상품 검색"
      options={products}
      placeholder="상품명을 입력해주세요"
      size="medium"
      style={{ borderRadius: '20px' }}
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
  )
}

const MobileMain = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [onNotify, setNotify] = useState(false)
  const [fcmToken, setFcmToken] = useState()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
        .then(function (permission) {
          console.log('Permission:', permission)
        })
        .catch(function (error) {
          console.error('Permission error:', error)
        })
    }
  }, [])
  // fcm을 위한 device 토큰 get
  useEffect(() => {
    const firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
    })

    const messaging = getMessaging(firebaseApp)

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FCM_VAP_ID_KEY,
    })
      .then((currentToken) => {
        if (currentToken) {
          setFcmToken(currentToken)
        } else {
          console.log('No registration token available. Request permission to generate one.')
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
      })
  }, [])

  // 알림 권한 요청

  // SSE 이벤트 핸들러(알림이 왔을때 알림 아이콘 변경을 위함)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token == null) return
      const base64Payload = token?.split('.')[1]
      const base64 = base64Payload?.replace(/-/g, '+')?.replace(/_/g, '/')
      const decodedJWT = JSON.parse(
        decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join(''),
        ),
      )

      let userEmail = decodedJWT.sub
      console.log(fcmToken)
      fetchExtended('/api/fcm/login-device', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, deviceToken: fcmToken }),
      }).catch((err) => {
        console.log(err)
      })

      const sse_url = `${process.env.NEXT_PUBLIC_API_URL}/api/fcm/connect?userEmail=${userEmail}`
      console.info('sse url', sse_url)

      const sse = new EventSource(sse_url, {
        withCredentials: true,
      })

      sse.addEventListener('connect', function (e) {
        if (e != null && e.data === 'NOTIFY_FCM') {
          setNotify(true)
        }
      })
    }
  }, [])

  // 자동 슬라이드 기능
  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextSlide = (currentSlide + 1) % carouselData.length
      setCurrentSlide(nextSlide)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [currentSlide])

  // 슬라이드 이동 함수
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex)
  }

  // 이전 슬라이드 이동 함수
  const prevSlide = () => {
    const nextSlide = (currentSlide - 1 + carouselData.length) % carouselData.length
    setCurrentSlide(nextSlide)
  }

  // 다음 슬라이드 이동 함수
  const nextSlide = () => {
    const nextSlide = (currentSlide + 1) % carouselData.length
    setCurrentSlide(nextSlide)
  }

  return (
    <div
      className="h-[calc(100vh-4rem)] items-center justify-items-center overflow-y-scroll"
      onClick={() => {
        Notification.requestPermission().then(function (permission) {})
      }}
    >
      <div className="   items-center  justify-items-center  bg-stone-500 pt-10">
        <div className=" items-center justify-items-stretch text-center">
          <div className="flex justify-center pl-24">
            <AppLogo />
            <div className="pl-16">
              <Link href="/m/alert">
                {onNotify ? (
                  <VscBellDot className="text-2xl text-amber-400 dark:text-gray-200" />
                ) : (
                  <AiFillBell className="text-2xl text-amber-400 dark:text-gray-200" />
                )}
              </Link>
            </div>
          </div>
        </div>

        <div
          id="default-carousel"
          className="w-full items-center justify-center p-4 text-center"
          data-carousel="slide"
        >
          <div className="relative h-48 overflow-hidden rounded-lg md:h-96">
            {carouselData.map((src, index) => (
              <div
                key={src}
                className={`duration-700 ease-in-out ${index === currentSlide ? 'block' : 'hidden'}`}
                data-carousel-item
              >
                <img src={src} className="block h-48 w-full" alt={`Slide ${index + 1}`} />
              </div>
            ))}
            <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-300'}`}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pt-4">
        <ProductSearchBar />
      </div>
      <div className=" px-6 pt-5 ">
        <div className="text-xm flex w-full max-w-full justify-around gap-0">
          <Link href="/m/access" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-100">
              <div className="text-6xl">
                <FaceId className="mb-1" />
              </div>
              <p>매장출입</p>
            </div>
          </Link>
          <Link href="/m/map" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-100">
              <div className="text-6xl">
                <SmallShop />
              </div>
              <p>매장찾기</p>
            </div>
          </Link>
          <Link href="/m/chatbot" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-100">
              <div className="text-6xl">
                <BubbleSearch />
              </div>
              <p>챗봇</p>
            </div>
          </Link>
        </div>
        <div className="mt-3">
          <ProductRank />
        </div>
      </div>
    </div>
  )
}
export default MobileMain
