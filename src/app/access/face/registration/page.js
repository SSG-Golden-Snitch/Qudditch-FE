'use client'
import { useEffect, useState } from 'react'
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness'
import { Loader } from '@aws-amplify/ui-react'
import { fetchExtended } from '@/utils/fetchExtended'

export default function LivenessQuickStartReact() {
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    const fetchCreateLiveness = async () => {
      await fetchExtended('/api/rekognition/liveness-session', { method: 'POST' })
        .then((res) => res.json())
        .then((res) => setSessionId(res))
    }

    fetchCreateLiveness().then((r) => setLoading(false))
  }, [])

  const handleAnalysisComplete = async () => {
    await fetchExtended(`/api/rekognition/liveness-session/${sessionId}?userId=3`)
      .then((res) => res.json())
      .then((res) => console.log(res))
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          sessionId={sessionId}
          region="ap-northeast-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={(error) => {
            console.error(error)
          }}
        />
      )}
    </>
  )
}
