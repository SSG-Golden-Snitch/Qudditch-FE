'use client'

import { useEffect, useRef, useState } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc'

const EnterCamPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const videoRef = useRef()
  const [channelARN, setChannelARN] = useState('')
  const [endpointsByProtocol, setEndpointsByProtocol] = useState({})
  const [iceServers, setIceServers] = useState([
    { urls: `stun:stun.kinesisvideo.${region}.amazonaws.com:443` },
  ])

  useEffect(() => {
    const handleWebRTC = async () =>
      await fetchExtended('/api/kinesis/web-rtc')
        .then((response) => response.json())
        .then((data) => {
          setEndpointsByProtocol(
            data['signalingChannelEndpoints'].reduce((endpoints, endpoint) => {
              endpoints[endpoint['protocol']] = endpoint['resourceEndpoint']
              return endpoints
            }, {}),
          )
          setIceServers(
            data['iceServers'].map((iceServer) => {
              return {
                urls: iceServer['urls'],
                username: iceServer['username'],
                credential: iceServer['credential'],
              }
            }),
          )
        })

    handleWebRTC().then(() => setIsLoading(false))
  }, [])

  const peerConnection = new RTCPeerConnection({
    iceServers: iceServers,
  })

  const signalingClient = new SignalingClient({
    channelARN,
    channelEndpoint: endpointsByProtocol['WSS'],
    role: 'MASTER',
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  useEffect(() => {
    console.log(endpointsByProtocol, iceServers)
    if (!videoRef.current) return
    signalingClient.on('open', async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream))
        videoRef.current.srcObject = localStream
      } catch (e) {
        console.log(e)
      }
    })
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {isLoading && (
        <div
          className={
            'absolute h-12 w-12 animate-spin rounded-md border-4 border-t-4 border-gray-500'
          }
        />
      )}
      {!isLoading && <video ref={videoRef} autoPlay playsInline muted className="h-96 w-96" />}
    </div>
  )
}

export default EnterCamPage
