'use client'

import useInterval from '@/components/hooks/useInterval'
import Drawing3d from '@/lib/Drawing3d'
import FaceDetection from '@/mediapipe/face-detection'
import initMediaPipVision from '@/mediapipe/mediapipe-vision'
import { CameraDevicesContext } from '@/providers/CameraDevicesProvider'
import {
  CAMERA_LOAD_STATUS_ERROR,
  CAMERA_LOAD_STATUS_NO_DEVICES,
  CAMERA_LOAD_STATUS_SUCCESS,
  ERROR_ENABLE_CAMERA_PERMISSION_MSG,
  ERROR_NO_CAMERA_DEVICE_AVAILABLE_MSG,
  FACE_DETECTION_MODE,
  NO_MODE,
} from '@/utils/definitions'
import '@mediapipe/tasks-vision'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import CameraSelect from '@/components/model-settings/CameraSelect'
import { fetchExtended } from '@/utils/fetchExtended'
import Loading from '@/components/ui/Loading'
import { BrowserQRCodeReader } from '@zxing/browser'

const Home = () => {
  const cameraDeviceProvider = useContext(CameraDevicesContext)
  const webcamRef = useRef(null)
  const canvas3dRef = useRef(null)
  const canvas2dRef = useRef(null)
  const [mirrored, setMirrored] = useState(false)
  const [modelLoadResult, setModelLoadResult] = useState()
  const [loading, setLoading] = useState(true)
  const [currentMode, setCurrentMode] = useState(NO_MODE)
  const [animateDelay, setAnimateDelay] = useState(1500)
  const [enteredCustomers, setEnteredCustomers] = useState([])
  const codeReader = new BrowserQRCodeReader()

  const initModels = async () => {
    const vision = await initMediaPipVision()

    if (vision) {
      const models = [await FaceDetection.initModel(vision)]

      const results = await Promise.all(models)
      const enabledModels = results.filter((result) => result.loadResult)

      if (enabledModels.length > 0) {
        setCurrentMode(enabledModels[0].mode)
      }
      setModelLoadResult(enabledModels)
    }
  }

  const handleCustomerEntered = async () => {
    const formData = new FormData()
    await new Promise((resolve) => {
      canvas2dRef.current.toBlob((blob) => {
        resolve(blob)
      })
    }).then(async (blob) => {
      formData.append('file', blob)
      await fetchExtended('/api/rekognition/check-face', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data['userIds'].length > 0) {
            const now = new Date()
            const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
            setEnteredCustomers([...enteredCustomers, time])
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  }

  const runPrediction = async () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      if (currentMode === FACE_DETECTION_MODE && !FaceDetection.isModelUpdating()) {
        const facePredictions = FaceDetection.detectFace(webcamRef.current.video)
        await codeReader.decodeOnceFromVideoElement(webcamRef.current.video).then((result) => {
          const now = new Date()
          const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
          setEnteredCustomers([...enteredCustomers, time])
        })

        if (facePredictions?.detections) {
          const canvas = canvas3dRef.current
          const video = webcamRef.current?.video

          if (canvas && video) {
            const { videoWidth, videoHeight } = video
            if (facePredictions?.detections.length > 0) {
              canvas2dRef.current.width = videoWidth
              canvas2dRef.current.height = videoHeight
              const ctx = canvas2dRef.current.getContext('2d')
              ctx.drawImage(video, 0, 0, videoWidth, videoHeight)

              await handleCustomerEntered()
            }

            Drawing3d.resizeCamera(videoWidth, videoHeight)
            FaceDetection.draw(mirrored, facePredictions.detections, videoWidth, videoHeight)
          }
        }
      }
    }
  }

  const canvas3dRefCallback = useCallback((element) => {
    if (element !== null && !Drawing3d.isRendererInitialized()) {
      canvas3dRef.current = element
      Drawing3d.initRenderer(element)
      console.log('init three renderer')
    }
  }, [])

  const webcamRefCallback = useCallback((element) => {
    if (element != null) {
      webcamRef.current = element
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Drawing3d.initScene(window.innerWidth, window.innerHeight)
    initModels()
  }, [])

  useEffect(() => {
    if (modelLoadResult) {
      setLoading(false)
    }
  }, [modelLoadResult])

  useEffect(() => {
    if (!loading) {
      if (cameraDeviceProvider?.status.status === CAMERA_LOAD_STATUS_ERROR) {
        alert(ERROR_ENABLE_CAMERA_PERMISSION_MSG)
      } else if (cameraDeviceProvider?.status.status === CAMERA_LOAD_STATUS_NO_DEVICES) {
        alert(ERROR_NO_CAMERA_DEVICE_AVAILABLE_MSG)
      }
    }
  }, [loading, cameraDeviceProvider?.status.status])

  useEffect(() => {
    const cleanup = () => {
      setAnimateDelay(null)
      webcamRef.current = null
      canvas3dRef.current = null
    }

    window.addEventListener('beforeunload', cleanup)
    return () => {
      window.removeEventListener('beforeunload', cleanup)
    }
  }, [])

  useInterval({ callback: runPrediction, delay: animateDelay })

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex h-screen flex-row items-center justify-between pt-6">
          {/* Camera area */}
          <div className={'flex h-full max-w-[80%] shrink grow flex-col px-4'}>
            <CameraSelect />
            <div className="relative flex">
              {cameraDeviceProvider?.status.status === CAMERA_LOAD_STATUS_SUCCESS &&
              cameraDeviceProvider?.webcamId ? (
                <>
                  <Webcam
                    ref={webcamRefCallback}
                    mirrored={mirrored}
                    className="h-full w-full object-contain p-2"
                    videoConstraints={{
                      deviceId: cameraDeviceProvider.webcamId,
                    }}
                  />
                  <canvas
                    id="3d canvas"
                    ref={canvas3dRefCallback}
                    className="absolute left-0 top-0 h-full w-full object-contain"
                  ></canvas>
                  {/* 보이지 않는 켄바스 */}
                  <canvas ref={canvas2dRef} className={'hidden'}></canvas>
                </>
              ) : cameraDeviceProvider?.status.status === CAMERA_LOAD_STATUS_ERROR ? (
                <div className="flex h-full w-full items-center justify-center">
                  Please Enable Camera Permission
                </div>
              ) : cameraDeviceProvider?.status.status === CAMERA_LOAD_STATUS_NO_DEVICES ? (
                <div className="flex h-full w-full items-center justify-center">
                  No Camera Device Available
                </div>
              ) : null}
            </div>
          </div>
          <div className={'mr-4 h-full max-w-[18%] grow overflow-auto border p-4 text-center'}>
            <ul>
              {enteredCustomers.map((customer, idx) => (
                <li key={idx}>{customer}: 출입문 열림</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
