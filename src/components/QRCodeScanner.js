import React, { useEffect, useState } from 'react'
import { BrowserQRCodeReader, NotFoundException } from '@zxing/library'

const QRCodeScanner = ({ onScan }) => {
  useEffect(() => {
    const codeReader = new BrowserQRCodeReader()
    let selectedDeviceId

    const startScan = () => {
      codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
        if (result) {
          onScan(result.getText())
          codeReader.reset() // 성공 후 즉시 리셋
        } else if (err && !(err instanceof NotFoundException)) {
          console.error('Scanning error:', err)
        }
      })
    }

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length > 0) {
          // 후면 카메라를 선택하도록 변경
          const rearCamera = videoInputDevices.find((device) => /back|rear/i.test(device.label))
          selectedDeviceId = rearCamera ? rearCamera.deviceId : videoInputDevices[0].deviceId // 후면 카메라가 없다면 첫번째 장치 사용
          startScan(selectedDeviceId)
        }
      })
      .catch((error) => console.error('Error listing video devices:', error))

    return () => {
      codeReader.reset()
      // Optionally stop the video stream if it's still running
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          stream.getTracks().forEach((track) => track.stop())
        })
      }
    }
  }, [onScan])

  return <video id="video" style={{ width: '100%' }} autoPlay />
}

export default QRCodeScanner
