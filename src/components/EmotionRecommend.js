'use client'

import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import Img from 'next/image'
import { fetchExtended, apiUrl } from '@/utils/fetchExtended'

const EmotionRecommend = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [userName, setUserName] = useState('')
  const [emotion, setEmotion] = useState('')
  const [emoji, setEmoji] = useState('')
  const [recommendProduct, setRecommendProduct] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const handleEmotion = (rawEmotion) => {
    switch (rawEmotion) {
      case 'CALM':
        setEmotion('편안해')
        setEmoji('😌')
        break
      case 'HAPPY':
        setEmotion('행복해')
        setEmoji('😊')
        break
      case 'SAD' || 'ANGRY':
        setEmotion('우울해')
        setEmoji('😢')
        break
      default:
        setEmotion('기분이 좋아')
        setEmoji('😊')
        break
    }
  }

  const handleRecommend = (data) => {
    setRecommendProduct(data)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token')
      if (!token) {
        console.log('token is null')
        return
      }
      const base64Payload = token.split('.')[1]
      const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
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

      console.log('decodedJWT: ', decodedJWT)
      setUserName(decodedJWT.name)
    } else {
      console.log('window is undefined')
    }
  }, [])

  const getRecommend = async () => {
    try {
      const recommendReqUrl = new URL(apiUrl + '/api/store/recommend/emotion')
      const response = await fetchExtended(recommendReqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const responseData = await response.json()
      if (responseData.status === 'success') {
        handleRecommend(responseData.data)
        handleEmotion(responseData.emotion)
        setIsLoading(false)
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    } catch (error) {
      console.error('Error fetching recommend product:', error)
    }
  }

  useEffect(() => {
    getRecommend()
  }, [])

  const hideRecommendation = () => {
    setIsVisible(false)
  }

  return (
    <>
      <div
        className={`fixed bottom-24 left-5 right-5 mx-2 flex w-auto items-center justify-between rounded-lg bg-white p-5 ${isVisible ? (isLoading ? 'scale-0 opacity-0' : 'scale-100 opacity-90') : 'hidden'} transform transition-opacity duration-500 ease-in-out`}
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="">
              <h2 className="text-sm ">
                오늘 <span className="font-semibold">{emotion}</span>보이는{' '}
                <span className="font-semibold">{userName}님</span>께 추천하는 상품 {emoji}
              </h2>
            </div>
            <button onClick={hideRecommendation} className="text-gray-500 hover:text-gray-700">
              <IoMdClose />
            </button>
          </div>

          <div className="mt-2 flex space-x-4 overflow-x-auto">
            <div className="flex items-center">
              <Img
                width={80}
                height={80}
                src={recommendProduct.productImage}
                alt={recommendProduct.productName}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="ml-2 pl-2 ">
                {/* <p className="text-sm ">{recommendProduct.brand} )</p> */}
                <p className="text-sm font-semibold">{recommendProduct.productName}</p>
                <p className="text-xs text-gray-600">{recommendProduct.productPrice}원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default EmotionRecommend
