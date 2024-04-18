'use client'
import { useState, useEffect, useRef } from 'react'
import { fetchExtended } from '@/utils/fetchExtended'
import { HiOutlineHome } from 'react-icons/hi2'
import { VscSend } from 'react-icons/vsc'
import dobbyImage from '/public/image/dobby.png'
import Image from 'next/image'
import { CiMicrophoneOn } from 'react-icons/ci'
import { BsStopCircle } from 'react-icons/bs'
import Link from 'next/link'
import Loading from '@/components/ui/Loading'

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (transcript !== '') {
      setIsLoading(true)
      setInputValue(transcript)
      setTranscript('')
    }
  }, [transcript])

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 웰컴 메시지를 추가.
    setMessages([
      {
        text: (
          <>
            안녕하세요, 챗봇 도비입니다. 만나서 반갑습니다. 무엇을 도와드릴까요?
            <Image src={dobbyImage} alt="도비" className="rounded-full" />
          </>
        ),
        sender: '도비',
        time: getTime(),
      },
    ])
  }, [])

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            console.log(latitude)
            console.log(longitude)

            sendMessageWithLocation(latitude, longitude)
          },
          (error) => {
            console.error('Geolocation error:', error)
          },
        )
      } else {
        console.error('Geolocation not supported')
      }
    }

    getLocation()
  }, [])

  const sendMessageWithLocation = async (longitude, latitude) => {
    try {
      const response = await fetchExtended(
        `/api/chatbot/chatbot?msg=&currentWgs84X=${longitude}&currentWgs84Y=${latitude}`,
      )
      const reader = response.body.getReader()
      let resultMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        resultMessage += decoder.decode(value)
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: resultMessage, sender: '도비', time: getTime() },
      ])
    } catch (error) {
      console.error('error', error)
    }
  }

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'ko-KR' // 한국어로 인식하도록 설정
    recognition.onresult = (event) => {
      const last = event.results.length - 1
      const text = event.results[last][0].transcript
      setTranscript(text)
    }
    recognition.onstart = () => {
      setListening(true)
    }
    recognition.onend = () => {
      setListening(false)
    }
    recognition.start()
  }

  const stopListening = () => {
    setListening(false) // 음성 인식 중 상태를 해제.
  }

  const handleMessageSend = async () => {
    const decoder = new TextDecoder('utf-8')

    try {
      if (inputValue === '') {
        return
      }

      if (!navigator.geolocation) {
        console.error('Geolocation not supported')
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          const response = await fetchExtended(
            `/api/chatbot/chatbot?msg=${inputValue}&currentWgs84X=${longitude}&currentWgs84Y=${latitude}`,
          )
          const reader = response.body.getReader()
          let resultMessage = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              break
            }
            resultMessage += decoder.decode(value)
          }

          setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputValue, sender: '나', time: getTime() },
            { text: resultMessage, sender: '도비', time: getTime() },
          ])

          setInputValue('')
        },
        (error) => {
          console.error('Geolocation error:', error)
        },
      )
    } catch (error) {
      console.error('error', error)
    }
  }

  const getTime = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm
    return formattedTime
  }

  const onTouchStartHandler = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="min-h-full min-w-full">
      <div className="chat-app mx-auto flex h-screen max-w-full flex-col rounded-lg  bg-gray-200 font-sans">
        <header className="chat-header flex min-w-full items-center  justify-between bg-gray-800 p-2 text-white">
          <div className="flex">
            <Image src={dobbyImage} alt="도비" className="h-8 w-8 rounded-full" />
            <h1 className="pl-3 text-lg font-semibold">Dobby Chat</h1>
          </div>
          <button className="home-button text-xl" aria-label="Home">
            <Link href="/m">
              <HiOutlineHome />
            </Link>
          </button>
        </header>
        <div className="chat-messages flex-1 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={index}>
              {/* 발신자의 이름이 있는 경우에만 표시 */}
              {message.sender && (
                <div
                  className="sender-info mb-2 font-medium text-gray-600"
                  style={{ textAlign: message.sender === '나' ? 'right' : 'left' }}
                >
                  {/* 발신자가 '나'이면 그대로 표시, 그 외에는 이미지로 대체 */}
                  {message.sender === '나' ? (
                    message.sender
                  ) : (
                    <Image src={dobbyImage} alt="도비" className="h-8 w-8 rounded-full" />
                  )}
                </div>
              )}

              <div
                className={
                  message.sender === '나' ? 'mb-4 flex justify-end' : 'mb-4 flex justify-start'
                }
              >
                <div className={message.sender === '나' ? 'message-right' : 'message-left'}>
                  <div
                    className={
                      message.sender === '나'
                        ? 'rounded-lg bg-yellow-100 p-3'
                        : 'rounded-lg bg-gray-100 p-3'
                    }
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    <p className="text-gray-800">{message.text}</p>
                    <span className="timestamp block text-right text-xs text-gray-500">
                      {message.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input flex items-center  bg-gray-300 p-3 pb-7">
          <button
            onClick={listening ? stopListening : startListening}
            className="mr-2 rounded-full bg-gray-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
          >
            {listening ? <BsStopCircle /> : <CiMicrophoneOn />}
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleMessageSend()
              }
            }}
            placeholder="Type a message..."
            className="flex-grow rounded-full border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />
          <button
            onTouchStart={handleMessageSend}
            disabled={!inputValue} // inputValue가 비어있을 때 버튼을 비활성화합니다.
            className="ml-2 rounded-full bg-gray-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
          >
            <VscSend />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
