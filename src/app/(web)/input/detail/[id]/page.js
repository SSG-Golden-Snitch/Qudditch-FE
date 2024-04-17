'use client'

import { CustomTable } from '@/components/CustomTable'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { CustomAlert } from '@/components/CustomAlert'
import Loading from '@/components/ui/Loading'

export default function InputDetail({ params: { id } }) {
  const [error, setError] = useState(null)
  const [inputDetail, setInputDetail] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const inputDetailReqUrl = apiUrl + `/api/store/stock/input/${id}`
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleData = () => {
    fetchExtended(inputDetailReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          throw new Error(res['message'])
        } else {
          setInputDetail(res['data'])
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsLoading(false)
    handleData()
  }, [])

  if (isLoading) return <Loading />

  return (
    <div className="flex h-screen flex-col bg-[#e4e4e4] px-10 py-10">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <div className="flex flex-col items-center pt-16">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="">
            <CustomTable
              handleAlert={handleAlert}
              handleData={handleData}
              data={inputDetail}
              params={id}
              header={[
                { label: 'productId', col_name: 'productId' },
                { label: 'brand', col_name: 'brand' },
                { label: 'name', col_name: 'name' },
                { label: 'price', col_name: 'price' },
                { label: 'quantity', col_name: 'qty' },
                { label: 'expirated', col_name: 'expDate' },
                { label: 'state', col_name: 'state' },
                { label: 'position', col_name: 'position' },
                { label: 'check', col_name: 'check' },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  )
}
