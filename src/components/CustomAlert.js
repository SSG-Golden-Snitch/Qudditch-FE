'use client'

import { Alert as FlowbiteAlert } from 'flowbite-react'
import { useEffect, useState } from 'react'

export function CustomAlert({ type, message, handleDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const timer = setTimeout(() => {
        handleDismiss('')
      }, 3000)
      return () => {
        clearTimeout(timer)
        setVisible(false)
      }
    }
  }, [message, handleDismiss])

  return (
    <div
      className={`fixed left-0 top-3 z-50 flex w-full items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <FlowbiteAlert color={type}>{message}</FlowbiteAlert>
    </div>
  )
}
