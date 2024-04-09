'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LuScanFace } from 'react-icons/lu'
import { BsShop } from 'react-icons/bs'
import { TbMessageCircleSearch } from 'react-icons/tb'
import { AiFillBell } from 'react-icons/ai'
import { Autocomplete, Flex, Loader, useTheme, View } from '@aws-amplify/ui-react'
import { fetchExtended } from '@/utils/fetchExtended'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ProductRank from './ProductRank'

const carouselData = ['d.jpg', 'veg.jpg', 'pb.jpg', 'b.jpg', 'c.png']

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
    router.push(`/product/${option['id']}`)
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
    }, 2000)

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
    <div className="mx-4">
      <br />
      <div className={'flex flex-row items-center justify-between '}>
        <ProductSearchBar />
        <AiFillBell className="text-3xl text-gray-700 dark:text-gray-200" />
      </div>
      <br />
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {carouselData.map((src, index) => (
            <div
              key={src}
              className={`duration-700 ease-in-out ${index === currentSlide ? 'block' : 'hidden'}`}
              data-carousel-item
            >
              <img src={src} className="block h-auto w-full" alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
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

        <button
          type="button"
          className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
          data-carousel-prev
          onClick={prevSlide}
        ></button>
        <button
          type="button"
          className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
          data-carousel-next
          onClick={nextSlide}
        ></button>
      </div>
      <br />
      <main className="flex justify-center p-4">
        <div className="flex w-full max-w-4xl justify-around">
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl">
              <LuScanFace />
            </div>
            <p>매장출입</p>
          </div>
          <Link href="/map" passHref>
            <div className="flex flex-col items-center text-center active:bg-gray-200">
              <div className="text-6xl">
                <BsShop />
              </div>
              <p>매장찾기</p>
            </div>
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl">
              <TbMessageCircleSearch />
            </div>
            <p>챗봇</p>
          </div>
        </div>
      </main>
      <div>
        <ProductRank />
      </div>
    </div>
  )
}
export default MobileMain
