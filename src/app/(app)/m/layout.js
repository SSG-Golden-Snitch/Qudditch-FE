'use client'

import { CheckLogin } from '@/utils/user'

const MLayout = ({ children }) => {
  return (
    <>
      <CheckLogin />
      {children}
    </>
  )
}

export default MLayout
