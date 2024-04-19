'use client'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useRouter } from 'next/navigation'

const Info = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen min-w-full bg-white">
      <button
        type="button"
        className="mb-4 flex items-center pl-4 pt-[2rem]"
        onClick={() => router.back()}
      >
        <IoIosArrowBack className="mr-2" />
        <h2 className="text-m font-semibold">앱 정보</h2>
      </button>
      <div className={'px-6'}>
        <table className={'w-full table-auto border-separate border-spacing-y-4 text-left'}>
          <thead>
            <tr className={''}>
              <th>버전 정보</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>시스템 버전 정보</td>
              <td className={'text-right'}>0.0.1</td>
            </tr>
            <tr>
              <td>웹 버전 정보</td>
              <td className={'text-right'}>0.0.1</td>
            </tr>
            <tr>
              <td>나의 버전 정보 복사</td>
              <td className={'flex justify-end text-right text-xl text-gray-400'}>
                <IoIosArrowForward />
              </td>
            </tr>
          </tbody>
        </table>
        <table className={'w-full border-separate border-spacing-y-4 text-left'}>
          <thead>
            <tr>
              <th>이용 정보</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이용약관</td>
              <td className={'flex justify-end text-right text-xl text-gray-400'}>
                <IoIosArrowForward />
              </td>
            </tr>
            <tr>
              <td>개인정보처리방침</td>
              <td className={'flex justify-end text-right text-xl text-gray-400'}>
                <IoIosArrowForward />
              </td>
            </tr>
          </tbody>
        </table>
        <table className={'w-full border-separate border-spacing-y-4 text-left'}>
          <thead>
            <tr>
              <th>기타</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>탈퇴하기</td>
              <td className={'flex justify-end text-right text-xl text-gray-400'}>
                <IoIosArrowForward />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Info
