'use client'

import { Sidebar } from 'flowbite-react'
import {
  HiChartPie,
  HiCreditCard,
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiViewBoards,
} from 'react-icons/hi'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiMiniVideoCamera } from 'react-icons/hi2'

const CustomSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Dashboard',
      icon: HiChartPie,
      path: '/',
    },
    {
      title: '재고관리',
      icon: HiViewBoards,
      path: '/inventory',
    },
    {
      title: '입고',
      icon: HiInbox,
      path: '/input',
    },
    {
      title: '발주',
      icon: HiUser,
      path: '/order',
    },
    {
      title: '폐기',
      icon: HiShoppingBag,
      path: '/discard',
    },
    {
      title: '판매',
      icon: HiCreditCard,
      path: '/sales',
    },
    {
      title: '출입 카메라',
      icon: HiMiniVideoCamera,
      path: '/enter-cam',
    },
  ]

  const isCurrentPage = (path) => {
    return path === pathname
  }

  return (
    <Sidebar aria-label={'Sidebar'}>
      <Sidebar.Logo href={'/'} img={''}>
        <span className={'self-center whitespace-nowrap text-xl font-semibold'}>Qudditch</span>
      </Sidebar.Logo>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {navItems.map((item, index) => {
            return (
              <Sidebar.Item
                as={Link}
                key={index}
                icon={item.icon}
                href={item.path}
                active={isCurrentPage(item.path)}
                onClick={() => router.push(item.path)}
              >
                {item.title}
              </Sidebar.Item>
            )
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default CustomSidebar
