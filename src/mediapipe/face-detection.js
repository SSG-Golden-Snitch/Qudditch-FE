import Drawing3d from '@/lib/Drawing3d'
import {
  DELEGATE_GPU,
  FACE_DETECTION_MODE,
  FACE_DETECTION_STR,
  RUNNING_MODE_VIDEO,
} from '@/utils/definitions'
import { FaceDetector } from '@mediapipe/tasks-vision'
import * as THREE from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

const FaceDetection = (() => {
  const MODEL_URL =
    'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite'

  const CONFIG_MIN_DETECTION_CONFIDENCE_VALUE = 0
  const CONFIG_MAX_DETECTION_CONFIDENCE_VALUE = 1
  const CONFIG_MIN_SUPPRESSION_THRESHOLD_VALUE = 0
  const CONFIG_MAX_SUPPRESSION_THRESHOLD_VALUE = 1
  const CONFIG_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE = 0.1
  const CONFIG_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE = 0.1

  let minDetectionConfidence = 0.9
  let minSuppressionThreshold = 0.5
  let runningMode = RUNNING_MODE_VIDEO
  let delegate = DELEGATE_GPU
  let isUpdating = false

  let faceDetector = null

  const initModel = async (vision) => {
    const result = {
      modelName: FACE_DETECTION_STR,
      mode: FACE_DETECTION_MODE,
      loadResult: false,
    }

    if (faceDetector) {
      result.loadResult = true
      return result
    }

    try {
      if (vision) {
        const config = getConfig()

        faceDetector = await FaceDetector.createFromOptions(vision, config)

        result.loadResult = true
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log(error)
      }
    }

    return result
  }

  const getConfig = () => {
    return {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: delegate,
      },
      minDetectionConfidence: minDetectionConfidence,
      minSuppressionThreshold: minSuppressionThreshold,
      runningMode: runningMode,
    }
  }

  const getRunningMode = () => runningMode
  const setRunningMode = (mode) => (runningMode = mode)

  const getMinDetectionConfidence = () => minDetectionConfidence
  const setMinDetectionConfidence = (min) => (minDetectionConfidence = min)

  const getMinSuppressionThreshold = () => minSuppressionThreshold
  const setMinSuppressionThreshold = (min) => (minSuppressionThreshold = min)

  const getInterfaceDelegate = () => delegate
  const setInterfaceDelegate = (del) => (delegate = del)

  const updateModelConfig = async () => {
    if (faceDetector) {
      isUpdating = true
      console.log('interface:', delegate)
      await faceDetector.setOptions(getConfig())
      isUpdating = false
    }
  }

  const isModelUpdating = () => {
    return isUpdating
  }

  const detectFace = (video) => {
    if (faceDetector) {
      try {
        return faceDetector.detectForVideo(video, performance.now())
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        } else {
          console.log(error)
        }
      }
    }

    return null
  }

  const draw = (mirrored, detections, width, height) => {
    if (detections) {
      Drawing3d.clearScene()
      const objGroup = new THREE.Object3D()
      detections.forEach((detected) => {
        if (detected.boundingBox) {
          const box = detected.boundingBox

          const points = []

          const cameraPos = Drawing3d.getCameraPosition()
          if (!cameraPos) {
            return
          }

          const rightPoint = cameraPos.x + width / 2
          const leftPoint = -rightPoint
          const topPoint = cameraPos.y + height / 2

          if (mirrored) {
            points.push(new THREE.Vector2(rightPoint - box.originX, topPoint - box.originY))
            points.push(
              new THREE.Vector2(rightPoint - box.originX - box.width, topPoint - box.originY),
            )
            points.push(
              new THREE.Vector2(
                rightPoint - box.originX - box.width,
                topPoint - box.originY - box.height,
              ),
            )
            points.push(
              new THREE.Vector2(rightPoint - box.originX, topPoint - box.originY - box.height),
            )
          } else {
            points.push(new THREE.Vector2(leftPoint + box.originX, topPoint - box.originY))
            points.push(
              new THREE.Vector2(leftPoint + box.originX + box.width, topPoint - box.originY),
            )
            points.push(
              new THREE.Vector2(
                leftPoint + box.originX + box.width,
                topPoint - box.originY - box.height,
              ),
            )
            points.push(
              new THREE.Vector2(leftPoint + box.originX, topPoint - box.originY - box.height),
            )
          }
          const bufferGeo = new THREE.BufferGeometry().setFromPoints(points)
          bufferGeo.setIndex([0, 1, 2, 3, 0])

          const unindexd = bufferGeo.toNonIndexed()
          const geo = new LineGeometry().setPositions(unindexd.getAttribute('position').array)
          const material = new LineMaterial({
            color: '#FF0F0F',
            linewidth: 0.008,
            vertexColors: false,
            worldUnits: false,
          })

          const line = new Line2(geo, material)
          objGroup.add(line)

          // Add text
          const label = Drawing3d.createLabel(
            'Face',
            detected.categories[0].score,
            '#FF0F0F',
            width,
            height,
            mirrored,
            box,
          )

          if (label) {
            objGroup.add(label)
          }
        }
      })

      objGroup.position.z = Drawing3d.calculateDistance(height)

      Drawing3d.addToScene(objGroup)
      Drawing3d.render()
    }
  }

  return {
    CONFIG_FACE_MIN_DETECTION_CONFIDENCE_VALUE: CONFIG_MIN_DETECTION_CONFIDENCE_VALUE,
    CONFIG_FACE_MAX_DETECTION_CONFIDENCE_VALUE: CONFIG_MAX_DETECTION_CONFIDENCE_VALUE,
    CONFIG_FACE_MIN_SUPPRESSION_THRESHOLD_VALUE: CONFIG_MIN_SUPPRESSION_THRESHOLD_VALUE,
    CONFIG_FACE_MAX_SUPPRESSION_THRESHOLD_VALUE: CONFIG_MAX_SUPPRESSION_THRESHOLD_VALUE,
    CONFIG_FACE_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE:
      CONFIG_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE,
    CONFIG_FACE_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE:
      CONFIG_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE,
    initModel,
    getInterfaceDelegate,
    setInterfaceDelegate,
    getMinDetectionConfidence,
    setMinDetectionConfidence,
    getMinSuppressionThreshold,
    setMinSuppressionThreshold,
    getRunningMode,
    setRunningMode,
    draw,
    detectFace,
    isModelUpdating,
    updateModelConfig,
  }
})()

export default FaceDetection
