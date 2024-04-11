import LocationStockPage from '@/components/inventoryList'

export async function getData({ params: { id } }) {
  const storeId = await getStoreId(id)
  return {
    id: storeId.id,
  }
}

export default async function Page({ params: { id } }) {
  return <LocationStockPage id={id} />
}
