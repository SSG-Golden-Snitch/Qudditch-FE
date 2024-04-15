'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { useEffect, useState } from 'react'
import { Table } from 'flowbite-react'
import { div } from 'three/nodes'

const AgeBestProduct = () => {
  const [ageBestProduct, setAgeBestProduct] = useState([])

  const handleAgeBestProduct = async () =>
    await fetchExtended('/api/product/best/age')
      .then((res) => res.json())
      .then((res) => res['result'])
      .catch((err) => console.error(err))

  useEffect(() => {
    handleAgeBestProduct().then((res) => setAgeBestProduct(res))
  }, [])

  return (
    <div className={'h-full w-full p-[10px]'}>
      <Table className={'text-center text-xl'}>
        <Table.Head className={'text-xl'}>
          <Table.HeadCell>Age</Table.HeadCell>
          <Table.HeadCell>Product</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {ageBestProduct &&
            ageBestProduct.map((product) => (
              <Table.Row key={product['age_group']}>
                <Table.Cell>{product['age_group'] + '대'}</Table.Cell>
                <Table.Cell>{product['name']}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default AgeBestProduct
