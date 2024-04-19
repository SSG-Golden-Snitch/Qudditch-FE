'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { Table } from 'flowbite-react'

const GenderBestProduct = () => {
  const [genderBestProduct, setGenderBestProduct] = useState([])

  const handleGenderBestProduct = async () =>
    await fetchExtended('/api/product/best/gender')
      .then((res) => res.json())
      .then((res) => res['result'])
      .catch((err) => console.error(err))

  useEffect(() => {
    handleGenderBestProduct().then((res) => setGenderBestProduct(res))
  }, [])

  return (
    <div className={'h-full w-full p-[20px] text-center '}>
      <div className="">
        <span className=" text-center text-xl font-bold text-gray-600">성별 인기 상품</span>
      </div>
      <Table className={'text-center text-xl'}>
        <Table.Head className={'text-xl'}>
          <Table.HeadCell>Gender</Table.HeadCell>
          <Table.HeadCell>Product</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {genderBestProduct &&
            genderBestProduct.map((product) => (
              <Table.Row key={product['gender']}>
                <Table.Cell>{product['gender']}</Table.Cell>
                <Table.Cell>{product['name']}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default GenderBestProduct
