'use client'

import { Accordion } from 'flowbite-react'
import { IoIosArrowBack } from 'react-icons/io'

export default function CustomerService() {
  const faqs = [
    {
      question: '얼굴 등록을 해야만 출입을 할 수 있나요?',
      answer:
        '얼굴 등록은 선택사항입니다. 얼굴 등록을 하지 않아도 QR코드를 발급받아 출입이 가능합니다.',
    },
    {
      question: '얼굴등록시 어떤 정보가 수집되나요?',
      answer: '얼굴등록시 얼굴의 특징점을 추출하여 저장하며, 얼굴의 이미지는 저장되지 않습니다.',
    },
  ]
  return (
    <div>
      <div>
        <button
          type="button"
          className="mb-2 flex items-center p-4"
          onClick={() => window.history.back()}
        >
          <IoIosArrowBack className="mr-2" />
          <h2 className="text-m font-semibold">FAQ</h2>
        </button>
      </div>
      <Accordion collapseAll>
        {faqs.map((faq, index) => (
          <Accordion.Panel key={index}>
            <Accordion.Title>{faq.question}</Accordion.Title>
            <Accordion.Content>{faq.answer}</Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    </div>
  )
}
