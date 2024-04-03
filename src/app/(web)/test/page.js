'use client'

import React from 'react'
import { useQRCode } from 'next-qrcode'

function App() {
  const { Canvas } = useQRCode()

  return (
    <Canvas
      text={'1728'}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: '#010599FF',
          light: '#ffffff',
        },
      }}
    />
  )
}

export default App
