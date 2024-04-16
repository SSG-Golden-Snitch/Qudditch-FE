'use client'
import { useState, useEffect } from 'react'
import AppLogo from '/public/AppLogo.svg'

const Splash = () => {
  const [showLogo, setShowLogo] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true)
      const logoTimer = setTimeout(() => setShowLogo(true), 500)
      return () => clearTimeout(logoTimer)
    }, 500)

    return () => clearTimeout(textTimer)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-stone-600 text-center text-zinc-50">
      <div className="">
        <div
          style={{
            opacity: showText ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        >
          <h1 className="mb-1">딜리셔스 아이디어</h1>
        </div>
        <div
          style={{
            opacity: showLogo ? 1 : 0,
            transition: 'opacity 1s ease',
            transform: `translateY(${showLogo ? '0' : '-33.3%'})`,
          }}
        >
          <AppLogo />
        </div>
      </div>
    </div>
  )
}

export default Splash
