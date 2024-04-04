import React from 'react'
import { LuScanFace } from 'react-icons/lu'
import { BsShop } from 'react-icons/bs'
import { PiShoppingCartBold } from 'react-icons/pi'
import { TbMessageCircleSearch } from 'react-icons/tb'

const TopHeader = () => {
  return (
    <header className="bg-yellow-400 p-4 text-center">
      <h1 className="text-2xl font-bold">SSGmart24</h1>
      <p className="text-gray-700">김진선님, 반가워요!</p>
      <p className="text-gray-700">신세계 포인트 784 p</p>
    </header>
  )
}

const MobileMain = () => {
  return (
    <div className="flex h-screen flex-col">
      <TopHeader />

      <main className="flex flex-grow justify-center p-4">
        <div className="flex flex-wrap justify-center gap-24">
          <div className="mt-64">
            <div className="flex flex-col items-center text-center  ">
              <div className="text-6xl ">
                <LuScanFace />
              </div>
              <p>매장출입</p>
            </div>
            <hr className="mb-12 mt-12 w-full border-t-2 border-gray-300" />
            <div className="mt-18"></div>
            <div className="flex flex-col items-center text-center ">
              <div className="text-6xl">
                <PiShoppingCartBold />
              </div>
              <p>재고찾기</p>
            </div>
          </div>
          <div className="mt-64">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl">
                <BsShop />
              </div>
              <p>매장찾기</p>
            </div>
            <hr className="mb-12 mt-12 w-full border-t-2 border-gray-300" />
            <div className="mt-"></div>
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl">
                <TbMessageCircleSearch />
              </div>
              <p>챗봇</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MobileMain
