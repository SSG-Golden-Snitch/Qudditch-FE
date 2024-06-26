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
          (pathname === path ? 'text-yellow-400' : ' text-stone-500')
        }
      >
        <div className={'flex flex-col items-center'}>
          <div className={'flex h-10 w-10 justify-center '}>{icon}</div>
          <span className={'flex justify-center text-xs '}>{name}</span>
        </div>
      </Link>
    )
  }

  const NavPayment = ({ path }) => {
    return (
      <Link href={path}>
        <div className={'z-20 flex cursor-pointer flex-col items-center'}>
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
    NavItem({ name: '홈', icon: <HiOutlineHome size={40} />, path: '/m' }),
    NavItem({ name: '포인트', icon: <CiHeart size={40} />, path: '/m/point' }),
    NavPayment({ path: '/m/store-select' }),
    NavItem({ name: '주문내역', icon: <CiReceipt size={40} />, path: '/m/order-history' }),
    NavItem({ name: '설정', icon: <CiSettings size={40} />, path: '/m/setting' }),
  ]

  return (
    <nav
      className={
        'fixed inset-x-0 bottom-0 z-10 block h-[4rem] rounded-t-2xl bg-gray-100 px-4 shadow'
      }
    >
      <div id="tabs" className={'flex justify-between'}>
        {navItems.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavbar
