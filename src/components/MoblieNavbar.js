'use client'

import { usePathname } from 'next/navigation'
import { CiBarcode, CiHeart, CiReceipt, CiSettings } from 'react-icons/ci'
import Link from 'next/link'
import { HiOutlineHome } from 'react-icons/hi2'

const MobileNavbar = () => {
  const pathname = usePathname()

  const NavItem = ({ name, icon, path }) => {
    return (
      <Link
        href={path}
        className={
          'inline-block w-full justify-center rounded-t-2xl pb-1 pt-2 text-center hover:bg-gray-200 hover:text-yellow-400 focus:bg-gray-200 focus:text-yellow-400' +
          (pathname === path ? 'text-yellow-400' : ' text-gray-500')
        }
      >
        <div className={'flex flex-col items-center'}>
          <div className={'h-10 w-10'}>{icon}</div>
          <span className={'text-xs'}>{name}</span>
        </div>
      </Link>
    )
  }

  const NavPayment = (path) => {
    return (
      <Link href={path} passHref>
        <div className={'z-20 flex cursor-pointer flex-col items-center'}>
          {/* Link 컴포넌트를 사용하여 /pay로의 링크를 생성 */}

          <div className="absolute bottom-5 left-1/2 flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full border border-amber-300 bg-amber-400 p-3 text-white">
            <div className={'text-4xl'}>
              <CiBarcode size={50} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const navItems = [
    NavItem({ name: '홈', icon: <HiOutlineHome size={40} />, path: '/main' }),
    NavItem({ name: '쿠폰함', icon: <CiHeart size={40} />, path: '/coupon' }),
    NavPayment(),
    NavItem({ name: '포인트', icon: <CiHeart size={40} />, path: '/point' }),
    NavPayment({ path: '/pay' }), // link로 감싸기
    NavItem({
      name: '주문내역',
      icon: <CiReceipt size={40} />,
      path: '/order-history',
    }),
    NavItem({ name: '설정', icon: <CiSettings size={40} />, path: '/web-setting' }),
  ]

  return (
    <nav className={'fixed inset-x-0 bottom-0 z-10 block rounded-t-2xl bg-gray-100 px-4 shadow'}>
      <div id="tabs" className={'flex justify-between'}>
        {navItems.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavbar
