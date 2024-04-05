'use client'

import { CameraDevicesContext } from '@/providers/CameraDevicesProvider'
import { useContext } from 'react'
import { Select } from 'flowbite-react'

const CameraSelect = () => {
  const VideoDevicesProvider = useContext(CameraDevicesContext)

  return (
    <Select
      value={VideoDevicesProvider?.webcamId}
      onChange={(e) => VideoDevicesProvider?.setWebcamId(e.target.value)}
    >
      {VideoDevicesProvider?.webcamList && VideoDevicesProvider?.webcamList.length > 0 ? (
        VideoDevicesProvider?.webcamList.map((webcam, index) => (
          <option key={index} value={webcam.deviceId} className={'text-left'}>
            {webcam.label.trim()}
          </option>
        ))
      ) : (
        <option value={''}>Webcam not found</option>
      )}
    </Select>
  )
}

export default CameraSelect
