import GetDetail from '@/components/orderUpdateList'

export default function OrderUpdate({ params: { id } }) {
  return (
    <div className="h-screen overflow-x-auto bg-[#e4e4e4] px-10 py-5">
      <GetDetail id={id} />
    </div>
  )
}
