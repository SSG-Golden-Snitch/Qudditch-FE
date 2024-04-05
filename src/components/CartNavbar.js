'use client'

const CartNavbar = ({ allSelected, handleSelectAllChange, totalAmount }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 bg-gray-100 shadow-md">
      <div className="flex items-center justify-between rounded-t-2xl p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
            className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 font-medium">전체</span>
          <span className="ml-4 font-bold">총액: {totalAmount}원</span>
        </div>
        <button className="ml-4 flex-1 bg-blue-500 px-4 py-2 text-lg font-medium text-white">
          결제하기
        </button>
      </div>
    </div>
  )
}

export default CartNavbar
