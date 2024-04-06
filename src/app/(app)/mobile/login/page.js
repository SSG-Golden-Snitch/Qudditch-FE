'use client'
// use client는 JavaScript의 strict mode를 활성화시킨다.
// strict mode는 좀 더 엄격한 JavaScript 문법을 적용하여 오류를 미연에 방지합니다.

// 필요한 모듈을 가져옵니다.
//fetchExtended 함수를 가져온다.
import { fetchExtended } from '@/utils/fetchExtended'
// flowbite-react 패키지에서 Button, Label, TextInput 컴포넌트를 가져옵니다.
import { Button, Label, TextInput } from 'flowbite-react'
import { useRef } from 'react' // React의 useRef 훅을 가져옵니다.

// 함수형 컴포넌트를 정의합니다.
function Component() {
  // userRef 훅을 사용하여 로그인 폼 요소에 대한 참조를 생성합니다.
  const loginRef = useRef()

  // 폼 제출 핸들러 함수를 정의합니다.
  const handleSubmit = async (e) => {
    e.preventDefault() // 기본 제출 동작을 방지합니다.

    // 이메일과 비밀번호를 데이터 객체에 저장합니다.
    const data = {
      email: loginRef.current?.elements.email.value, // 이메일 입력란의 값
      password: loginRef.current?.elements.password.value, // 비밀번호 입력란의 값
    }
    try {
      //POST 요청을 통해 데이터를 서버로 전송합니다.
      await fetchExtended('/login', {
        method: 'POST',
        body: JSON.stringify(data), // 데이터를 JSON 문자열로 변경하여 전송합니다.
        headers: {
          'Content-Type': 'application/json', //JSON 형식의 데이터라는 것을 명시합니다.
        },
      })

      //  서버로부터 응답으 JSPON 형식으로 파싱합니다.
      const responseData = await response.json()

      // 서버 응답을 처리합니다.
      if (typeof window !== 'undefined') {
        if (responseData.error) {
          alert(responseData.error) // 에러가 있는 경우 에러를 알립니다.
        } else {
          alert('Login success') // 로그인 성공 메시지를 알립니다.
          sessionStorage.setItem('token', responseData.token) // 토큰을 세션 스토리지에 저장합니다.
        }
      }
    } catch (error) {
      console.error('Login request error:', error) // 요청 중 오류가 발생한 경우 콘솔에 에러를 출력합니다.
      alert('An error occurred while logging in') // 로그인 중 오류를 알립니다.
    }
  }

  return (
    //   중간정렬
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit} ref={loginRef}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput id="email" type="email" placeholder="name@flowbite.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput id="password" type="password" required />
      </div>
      <Button type="submit" className="bg-yellow-400">
        로그인
      </Button>
    </form>
  )
}

export default Component
