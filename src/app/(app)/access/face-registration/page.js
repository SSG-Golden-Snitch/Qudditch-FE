'use client'

import { useCallback, useEffect, useState } from 'react'
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness'
import { Button, Flex, Heading } from '@aws-amplify/ui-react'
import { fetchExtended } from '@/utils/fetchExtended'
import {
  cameraDisplayText,
  customDefaultErrorDisplayText,
  hintDisplayText,
  instructionDisplayText,
  streamDisplayText,
} from './LivenessUtil'
import { useRouter } from 'next/navigation'

const FaceRegistrationPage = () => {
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState('')
  const router = useRouter()
  const ANALYSIS_SUCCESS_MSG = 'SUCCEEDED'

  useEffect(() => {
    const fetchCreateLiveness = async () => {
      await fetchExtended('/api/rekognition/liveness-session', { method: 'POST' })
        .then((res) => res.json())
        .then((res) => setSessionId(res['sessionId']))
    }

    fetchCreateLiveness().then(() => setLoading(false))
  }, [])

  const handleAnalysisComplete = async () => {
    await fetchExtended(`/api/rekognition/liveness-session/${sessionId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res['result']['status'] === ANALYSIS_SUCCESS_MSG) {
          router.replace('/access/face-registration/success')
          return
        }
        throw new Error(res['error'])
      })
      .catch((err) => {
        router.push(`/access/face-registration/failed?msg=${err.message}`)
      })
  }

  return (
    <>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-20 w-20 animate-ping rounded-full bg-violet-800"></div>
        </div>
      ) : (
        <FaceLivenessDetector
          sessionId={sessionId}
          region="ap-northeast-1"
          onAnalysisComplete={handleAnalysisComplete}
          onUserCancel={() => router.back()}
          disableStartScreen={true}
          displayText={{
            ...hintDisplayText,
            ...cameraDisplayText,
            ...instructionDisplayText,
            ...streamDisplayText,
            ...customDefaultErrorDisplayText,
          }}
        />
      )}
    </>
  )
}

export default FaceRegistrationPage
