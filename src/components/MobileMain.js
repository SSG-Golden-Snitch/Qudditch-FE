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

const carouselData = ['1.png', '2.png', '3.png', '4.png', '5.png']

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

  const renderOption = (option, value) => {
    const { id, brand, name, image } = option
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
    <div className=" h-[calc(100vh-4rem)] items-center justify-items-center overflow-y-scroll ">
      <div className=" grid   items-center  justify-items-center  bg-stone-600 pt-10">
        <div className="grid grid-cols-2 items-center justify-items-center text-center">
          <AppLogo className="col-start-1 " />
          <AiFillBell className="col-end-7 text-2xl text-amber-400 dark:text-gray-200" />
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
                <img src={src} className="block h-auto w-full" alt={`Slide ${index + 1}`} />
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
      <div className="p-3">
        <ProductSearchBar />
      </div>
      <div className="  px-7 pt-5">
        <div className="text-xm flex w-full max-w-4xl justify-around gap-0">
          <Link href="/access" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-100">
          <Link href="/m/access" passHref>
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl">
                <FaceId className="mb-1" />
              </div>
              <p>매장출입</p>
            </div>
          </Link>
          <Link href="/map" passHref>
          <Link href="/m/map" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-200">
              <div className="text-6xl">
                <SmallShop />
              </div>
              <p>매장찾기</p>
            </div>
          </Link>
          <Link href="chatbot" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-100">
          <Link href="/m/chatbot" passHref>
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl">
                <BubbleSearch />
              </div>
              <p>챗봇</p>
            </div>
          </Link>
        </div>
        <div className="mt-3 p-5">
          <ProductRank />
        </div>
      </div>
    </div>
  )
}
export default MobileMain
