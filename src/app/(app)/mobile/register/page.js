// src/app/mobile/register/page.js
'use client'
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Register() {
  // 상태 관리를 위한 훅 선언
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')
  const [emailStatus, setEmailStatus] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  // 이 컴포넌트는 페이지 디렉토리의 일부여야 라우터에 접근할 수 있다.
  const router = useRouter()

  useEffect(() => {
    // 라우터가 준비되었을 때만 실행
    if (router.isReady) {
      const verificationCode = router.query.code

      if (verificationCode) {
        verifyAccount(verificationCode)
      }
    }
  }, [router.isReady, router.query]) // router.isReady와 router.query를 의존성 배열에 추가

  // 이메일 중복 확인 함수
  // 문제1. Axios가 아닌 fetch를 사용할때 사용법을 익히고 사용 .then() 잘확인
  // 문제2. 백에서 리턴값이 확실할때는  ResponseEntity<?>와일드카드 사용하지 않기
  // 문제3. 리턴값에 대한 결과값 반환 방식을 제대로 이해하기
  // 문제4. fetch 사용할때 json으로 안보내두됨 간단한건
  // 문제5. 중요도 하 RESTFull API 작성법 이해 GET, POST, PUT, DELETE
  // 문제6. 이메일 중복 확인중 오류가 발생했습니다. (X) -> 중복된 이메일입니다.
  // 문제7. 비동기가 너무 많아 상관은없는데 필요없는부분에도 사용중이다.
  // 문제8. 프로미스함수 에 대해 공부하기 비동기 / 동기 관련
  const checkEmail = async () => {
    setLoading(true)
    setEmailStatus('')
    fetch('http://localhost:8080/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json()) // JSON 응답을 파싱
      .then((data) => {
        // "message" 키에 해당하는 값을 사용하여 상태를 설정
        setEmailStatus(data.message) // "사용 가능한 이메일입니다." 또는 "이미 사용 중인 이메일입니다."
        setEmailVerified(data.message === '사용 가능한 이메일입니다.')
      })
      .catch((error) => {
        setEmailStatus('이메일 중복 확인 중 오류가 발생했습니다.')
        setEmailVerified(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  //인증이메일보내기
  const sendVerificationEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setLoading(false)
      if (data.success) {
        setEmailVerified(true)
        setVerificationStatus(data.message)
      } else {
        setVerificationStatus(data.message)
      }
    } catch (error) {
      setLoading(false)
      setVerificationStatus('서버 에러가 발생했습니다.')
    }
  }

  // 계정 인증 요청
  const verifyAccount = async (code) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/verify-account?code=${code}`)
      const data = await response.json()
      setLoading(false)
      if (data.verificationStatus) {
        setVerificationStatus('인증 완료')
      } else {
        setVerificationStatus('인증 실패: 유효하지 않은 코드입니다.')
      }
    } catch (error) {
      setLoading(false)
      setVerificationStatus('인증 실패: 서버에 문제가 발생했습니다.')
    }
  }

  // 회원가입후 제출하기버튼
  const handleSubmit = async (event) => {
    event.preventDefault()

    // 먼저 이메일 인증이 완료되었는지 확인합니다.
    if (!emailVerified) {
      alert('이메일 인증을 먼저 완료해주세요.')
      return
    }

    // 비밀번호가 일치하는지 확인합니다.
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          //state: emailVerified ? 1 : 0 // emailVerified가 true이면 state를 1로 설정
        }),
      })
      const data = await response.json()
      setLoading(false)
      if (response.ok) {
        alert('회원가입 성공: 인증 이메일이 발송되었습니다. 이메일을 확인해주세요.')
        router.push('/login')
      } else {
        alert(data.message || '회원가입 실패')
      }
    } catch (error) {
      setLoading(false)
      alert(error.message || '회원가입 중 에러가 발생했습니다.')
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    try {
      // '/verify-code' 엔드포인트 호출 대신 '/verify-account' 엔드포인트 사용
      const res = await fetch(`http://localhost:8080/verify-account?code=${verificationCode}`, {
        method: 'POST',
      })
      const data = await res.json()
      setLoading(false)
      if (res.ok) {
        setVerificationStatus('인증에 성공했습니다.')
        setEmailVerified(true)
        setVerificationCode('') // 인증 후 코드 필드 비우기
      } else {
        setVerificationStatus('인증에 실패했습니다.')
      }
    } catch (error) {
      setLoading(false)
      setVerificationStatus('서버 에러가 발생했습니다.')
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">이메일</Label>
          <div className="flex items-center gap-2">
            <TextInput
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={checkEmail} disabled={loading || !email}>
              {loading ? '확인 중...' : '이메일 중복 체크'}
            </Button>
          </div>
          {emailStatus && (
            <Alert color={emailStatus === '사용 가능한 이메일입니다.' ? 'success' : 'failure'}>
              {emailStatus}
            </Alert>
          )}
        </div>
        <Button onClick={sendVerificationEmail} disabled={loading}>
          {loading ? '보내는 중...' : '인증 이메일 보내기'}
        </Button>
        {verificationStatus && (
          <Alert color={verificationStatus?.startsWith('인증 완료') ? 'success' : 'failure'}>
            {verificationStatus}
          </Alert>
        )}
        <div>
          <Label htmlFor="verificationCode">인증 코드</Label>
          <TextInput
            id="verificationCode"
            type="text"
            placeholder="인증 코드를 입력하세요"
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <Button onClick={handleVerifyCode}>인증하기</Button>
        </div>
        <div>
          <Label htmlFor="password">비밀번호</Label>
          <TextInput
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
            }}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <TextInput
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setPasswordError('')
            }}
          />
          {passwordError && <Alert color="failure">{passwordError}</Alert>}
        </div>
        <div>
          <Label htmlFor="name">이름</Label>
          <TextInput
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
      </form>
      {verificationStatus && (
        <Alert color={verificationStatus.startsWith('인증 완료') ? 'success' : 'failure'}>
          {verificationStatus}
        </Alert>
      )}
      {loading && <Alert color="info">처리 중...</Alert>}
    </div>
  )
}
