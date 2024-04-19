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
import { CheckLogin } from '@/utils/user'

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

  function parseJSON(jsonString) {
    try {
      return JSON.parse(jsonString.substring(1, jsonString.length - 1))
    } catch (error) {
      console.error('Invalid JSON string:', error)
      return null
    }
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

  const recognitionRef = useRef(null) // recognition 객체를 useRef를 사용하여 상태로 관리

  const startListening = () => {
    if (recognitionRef.current && recognitionRef.current.state === 'listening') {
      recognitionRef.current.stop()
      setListening(false)
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'ko-KR'
    recognitionRef.current = recognition // recognition 객체를 useRef를 통해 상태로 관리
    recognition.onresult = (event) => {
      const last = event.results.length - 1
      const text = event.results[last][0].transcript
      setTranscript(text)
    }
    recognition.onstart = () => {
      setListening(true)
      setTimeout(() => {
        recognition.stop()
      }, 5000)
    }
    recognition.onend = () => {
      setListening(false)
    }
    recognition.start()
  }

  const stopListening = () => {
    setListening(false)
  }

  const handleMessageSend = async () => {
    const decoder = new TextDecoder('utf-8')

    try {
      if (inputValue === '') {
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

          const responseObject = parseJSON(resultMessage)
          let msg
          if (responseObject) {
            if (responseObject.type === 'best') {
              msg = (
                <table className={'table-auto p-6 text-center'}>
                  <thead>
                    <tr>
                      <th>BEST 제품명</th>
                      <th>가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseObject.data.map((item, idx) => (
                      <tr key={idx}>
                        <td className={'pr-5 text-left'}>{item.name}</td>
                        <td className={'whitespace-nowrap'}>{item.price}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            } else if (responseObject.type === 'random') {
              msg = (
                <table className={'table-auto p-6 text-center'}>
                  <thead>
                    <tr>
                      <th>오늘의 추천 제품</th>
                      <th>가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseObject.data.map((item, idx) => (
                      <tr key={idx}>
                        <td className={'pr-5 text-left'}>{item.name}</td>
                        <td className={'whitespace-nowrap'}>{item.price}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            } else if (responseObject.type === 'price') {
              msg = (
                <table className={'table-auto p-6 text-center'}>
                  <thead>
                    <tr>
                      <th>제품명</th>
                      <th>가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseObject.data.map((item, idx) => (
                      <tr key={idx}>
                        <td className={'pr-5 text-left'}>{item.name}</td>
                        <td className={'whitespace-nowrap'}>{item.price}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            } else if (responseObject.type === 'select002') {
              msg = (
                <table className={'table-auto p-6 text-center'}>
                  <thead>
                    <tr>
                      <th className={'text-left'}>가게명</th>
                      <th className={'text-center'}>주소</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseObject.data.map((item, idx) => (
                      <tr key={idx}>
                        <td className={'whitespace-nowrap pr-5 text-left'}>{item.name}</td>
                        <td className={'text-left'}>{item.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            } else if (responseObject.type === 'select001') {
              msg = (
                <table className={'table-auto p-6 text-center'}>
                  <thead>
                    <tr>
                      <th className={'text-left'}>제품명</th>
                      <th>주소</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseObject.data.map((item, idx) => {
                      if (item.stores && item.stores.length > 0) {
                        return (
                          <tr key={idx}>
                            <td className={'whitespace-nowrap pr-5 text-left'}>{item.name}</td>
                            <td className={'text-left'}>{item.stores[0].address}</td>
                          </tr>
                        )
                      }
                    })}
                  </tbody>
                </table>
              )
            }
          } else {
            msg = resultMessage
          }

          setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputValue, sender: '나', time: getTime() },
            { text: msg, sender: '도비', time: getTime() },
          ])

          setInputValue('')
        },
        (error) => {
          console.error('Geolocation error:', error)
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: '위치 정보를 사용할 수 없습니다 위치 정보를 활성화해주세요',
              sender: '도비',
              time: getTime(),
            },
          ])
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
              {message.sender && (
                <div
                  className="sender-info mb-2 font-medium text-gray-600"
                  style={{ textAlign: message.sender === '나' ? 'right' : 'left' }}
                >
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
                    <div className="text-gray-800">{message.text}</div>
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
            className="mr-2 rounded-full bg-gray-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
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
            disabled={!inputValue}
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
