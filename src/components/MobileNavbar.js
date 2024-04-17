'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CiBarcode } from 'react-icons/ci'
import { FaCoins, FaHome, FaReceipt } from 'react-icons/fa'
import { FaHammer } from 'react-icons/fa6'

const MobileNavbar = () => {
  const pathname = usePathname()

  const NavItem = ({ name, icon, path }) => {
    return (
      <Link
        href={path}
        className={
          'inline-block w-full justify-center rounded-t-2xl pb-1 pt-2 text-center ' +
          (pathname === path ? 'text-amber-400' : ' text-stone-500')
        }
      >
        <div className={'flex flex-col items-center'}>
          <div className={'flex justify-center pb-1 '}>{icon}</div>
          <span className={'flex justify-center text-xs '}>{name}</span>
        </div>
      </Link>
    )
  }

  const NavPayment = ({ path }) => {
    return (
      <Link href={path}>
        <div className={'z-20 flex cursor-pointer flex-col items-center'}>
          <div className="absolute bottom-10 left-1/2 flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full border border-amber-300 bg-amber-400 p-3 font-extrabold text-white">
            <div>
              <CiBarcode size={50} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const navItems = [
    NavItem({ name: '홈', icon: <FaHome size={25} />, path: '/m' }),
    NavItem({ name: '포인트', icon: <FaCoins size={25} />, path: '/m/point' }),
    NavPayment({ path: '/m/store-select' }),
    NavItem({ name: '구매내역', icon: <FaReceipt size={25} />, path: '/m/order-history' }),
    NavItem({ name: '설정', icon: <FaHammer size={25} />, path: '/m/setting' }),
  ]

  return (
    <nav
      className={
        'fixed inset-x-0 bottom-0 z-10 block h-[5rem] rounded-t-2xl bg-gray-100 px-8 shadow'
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
