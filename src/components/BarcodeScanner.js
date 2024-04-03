'use client'

import React, { useState, useEffect } from 'react'
import {
  BrowserQRCodeReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from '@zxing/library'

export default function BarcodeScanner({ handleResult, handleCloseModal, render }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [code, setCode] = useState('')
  const [videoInputDevices, setVideoInputDevices] = useState([])
  const [isDecoding, setIsDecoding] = useState(false)
  const codeReader = render

  // const codeReader = new BrowserQRCodeReader()

  console.log('ZXing code reader initialized')

  useEffect(() => {
    codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        setupDevices(videoInputDevices)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  function setupDevices(videoInputDevices) {
    setSelectedDeviceId(videoInputDevices[0].deviceId)

    if (videoInputDevices.length >= 1) {
      setVideoInputDevices(videoInputDevices)
    }
  }

  function decodeContinuously(selectedDeviceId) {
    codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
      if (result) {
        console.log('Found QR code!', result)
        setCode(result.text)
        handleResult(result.text)
        codeReader.stopContinuousDecode()
        setIsDecoding(false)
        handleCloseModal(false)
      }

      if (err) {
        setCode('')

        if (err instanceof NotFoundException) {
          console.log('No QR code found.')
        }

        if (err instanceof ChecksumException) {
          console.log("A code was found, but it's read value was not valid.")
        }

        if (err instanceof FormatException) {
          console.log('A code was found, but it was in an invalid format.')
        }
      }
    })
  }

  useEffect(() => {
    if (selectedDeviceId && !isDecoding) {
      setIsDecoding(true)
      decodeContinuously(selectedDeviceId)
      console.log(`Started decode from camera with id ${selectedDeviceId}`)
    }
  }, [selectedDeviceId, isDecoding])

  return (
    <main>
      <section className="container" id="demo-content">
        <div>
          <video id="video" width="300" height="200" />
        </div>
      </section>
    </main>
  )
}
