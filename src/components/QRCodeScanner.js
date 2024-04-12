// QRCodeScanner 컴포넌트 수정
import React, { useEffect, useState } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

const QRCodeScanner = ({ onScan, selectedStore }) => {
  // selectedStore props 추가
  const [videoInputDevices, setVideoInputDevices] = useState([])
  const [error, setError] = useState(null) // 오류 상태 추가

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
            setError(err) // 오류 상태 업데이트
            console.error('QR 코드 디코딩 오류:', err)
            // 오류 처리
            // 예: 사용자에게 오류 메시지 표시 또는 다시 시도
          }
        })
      }
    })

    return () => {
      codeReader.reset()
    }
  }, [onScan, selectedStore]) // selectedStore props를 의존성 배열에 추가

  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div> // 오류 메시지 표시
  }

  return <video id="video" style={{ width: '100%' }} />
}

export default QRCodeScanner
