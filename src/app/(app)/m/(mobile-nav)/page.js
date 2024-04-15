'use client'

import { useState, useEffect } from 'react'
import Splash from '@/components/Splash'
import MobileMain from '@/components/MobileMain'

const Main = () => {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div>
      {showSplash ? (
        <Splash />
      ) : (
        <div>
          <MobileMain />
        </div>
      )}
    </div>
  )
}

export default Main
