// QRCodeScanner.jsx
import React, { useEffect, useState } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

const QRCodeScanner = ({ onScan }) => {
  const [videoInputDevices, setVideoInputDevices] = useState([])

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader()
    codeReader.listVideoInputDevices().then((videoInputDevices) => {
      setVideoInputDevices(videoInputDevices)
      if (videoInputDevices.length > 0) {
        const selectedDeviceId = videoInputDevices[0].deviceId
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
          if (result) {
            onScan(result.getText())
            codeReader.reset()
          }
          if (err) {
            console.error(err)
          }
        })
      }
    })

    return () => {
      codeReader.reset()
    }
  }, [onScan])

  return <video id="video" style={{ width: '100%' }} />
}

export default QRCodeScanner
