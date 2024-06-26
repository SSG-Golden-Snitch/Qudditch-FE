const { useState, useEffect } = require('react')
import { fetchExtended } from '@/utils/fetchExtended'

export async function getRank() {
  const response = await fetchExtended(`/api/product/rank`)
  return response.json()
}

export default function ProductRank() {
  const [rank, setRank] = useState([])
  const [userName, setUserName] = useState('')

  const handleRank = async () => {
    await getRank().then((data) => {
      setRank(data)
    })
  }

  // jwt 토큰에서 name 들고오는
  useEffect(() => {
    handleRank()

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
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

  return (
    <div className="flex flex-col space-y-4 overflow-hidden rounded-2xl bg-stone-200 p-4">
      {userName ? (
        <h3 className="text-lg">
          <span className="font-bold">{userName}</span>님을 위한 추천상품 🧚‍♀️
        </h3>
      ) : (
        <h3 className="text-lg">오늘의 추천상품 🧚‍♀️</h3>
      )}
      <div className="flex space-x-4 overflow-x-auto">
        {rank.map((product) => (
          <div key={product.productId} className="w-20 flex-none">
            <img
              src={product.productImage}
              alt={product.productName}
              className="h-auto w-full rounded-lg object-cover"
            />
            <div className="mt-1 text-sm font-medium">{product.productName}</div>
            {/* <div className="text-sm">{`${product.price.toLocaleString()}원`}</div> */}
          </div>
        ))}
      </div>
    </div>
  )
}
