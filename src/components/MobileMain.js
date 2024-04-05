'use client'
import React, { useState, useEffect } from 'react'
import { LuScanFace } from 'react-icons/lu'
import { BsShop } from 'react-icons/bs'
import { TbMessageCircleSearch } from 'react-icons/tb'
import { AiFillBell } from 'react-icons/ai'

const carouselData = ['d.jpg', 'veg.jpg', 'pb.jpg', 'b.jpg', 'c.png']

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
      <form className="relative mx-auto max-w-md">
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
              placeholder="제품명 입력하삼 !"
              required
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 rounded-r-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Search
            </button>
          </div>
          <AiFillBell className="ml-2 text-3xl text-gray-700 dark:text-gray-200" />
        </div>
      </form>
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
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl">
              <BsShop />
            </div>
            <p>매장찾기</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl">
              <TbMessageCircleSearch />
            </div>
            <p>챗봇</p>
          </div>
        </div>
      </main>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}
export default MobileMain
