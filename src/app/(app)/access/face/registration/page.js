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
} from '@/app/(app)/access/face/registration/LivenessUtil'

export default function LivenessQuickStartReact() {
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState('')
  const [error, setError] = useState(undefined)

  useEffect(() => {
    const fetchCreateLiveness = async () => {
      await fetchExtended('/api/rekognition/liveness-session', { method: 'POST' })
        .then((res) => res.json())
        .then((res) => setSessionId(res['sessionId']))
    }

    fetchCreateLiveness().then((r) => setLoading(false))
  }, [])

  const handleAnalysisComplete = async () => {
    // await fetchExtended(`/api/rekognition/liveness-session/${sessionId}`).then((res) => res.json())
  }

  const CustomError = useCallback(() => {
    return (
      <Flex justifyContent="center" alignItems="center" width="100%" height="100%">
        <Flex backgroundColor="white" direction="column" justifyContent="center" padding="32px">
          <Heading color="black">{error?.state}</Heading>
          <p>{error?.error.message}</p>
          <Button>Try again?</Button>
        </Flex>
      </Flex>
    )
  }, [error])

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <FaceLivenessDetector
          sessionId={sessionId}
          region="ap-northeast-1"
          disableStartScreen={true}
          onAnalysisComplete={handleAnalysisComplete}
          onError={setError}
          displayText={{
            ...hintDisplayText,
            ...cameraDisplayText,
            ...instructionDisplayText,
            ...streamDisplayText,
            ...customDefaultErrorDisplayText,
          }}
          components={{
            ErrorView: CustomError,
          }}
        />
      )}
    </>
  )
}
