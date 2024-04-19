// src/app/mobile/register/page.js
'use client'
import { Alert, Button, Label, TextInput, Checkbox } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import WebLogo from '/public/WebLogo.svg'
import { HiMail } from 'react-icons/hi'
import { HiKey, HiLockClosed, HiUser } from 'react-icons/hi2'
import { CustomAlert } from '@/components/CustomAlert'
import { PrivacyModal } from '@/components/PrivacyModal'

export default function Register() {
  // 상태 관리를 위한 훅 선언
  const router = useRouter()
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
  const [emailError, setEmailError] = useState(false)
  const [emailColor, setEmailColor] = useState('gray')
  const [emailDupleText, setEmailDupleText] = useState('')
  const [emailDupleCss, setEmailDupleCss] = useState('text-gray-500')
  const [sendBtn, setSendBtn] = useState(false)
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')
  const [codeColor, setCodeColor] = useState('gray')
  const [codeText, setCodeText] = useState('')
  const [codeCss, setCodeCss] = useState('text-gray-500')
  const [PWColor, setPWColor] = useState('gray')
  const [confirmPWColor, setConfirmPWColor] = useState('gray')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [agree, setAgree] = useState(false)
  const [emailState, setEmailState] = useState('')
  const [state, setState] = useState('0')

  const handleSubmit = () => {
    if (!email || !password || !confirmPassword || !name || !verificationCode) {
      handleAlert('failure', '모든 항목을 입력해주세요.')
      return
    }
    if (emailState !== 'verified') {
      handleAlert('failure', '이메일 인증을 완료해주세요.')
      return
    }
    if (!agree) {
      handleAlert('failure', '개인정보 처리방침에 동의해주세요.')
      return
    }
    if (password.length < 8) {
      handleAlert('failure', '비밀번호는 8자리 이상이어야 합니다.')
      return
    }
    if (password !== confirmPassword) {
      handleAlert('failure', '비밀번호가 일치하지 않습니다.')
      return
    } else {
      const submitReqUrl = new URL(apiUrl + `/register/user`)
      fetchExtended(submitReqUrl, {
        method: 'POST',
        body: JSON.stringify({ name, email, password, state }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          if (res['status'] === 'fail') {
            handleAlert('failure', res['message'])
          }
          if (res['status'] === 'success') {
            handleAlert('success', res['message'])
            router.push('/mobile/login')
          }
        })
    }
  }

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleVerifyCode = () => {
    const data = { email: email, code: verificationCode }
    fetchExtended('/verify-user', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'fail') {
          console.log(res)
          setCodeText('인증번호가 일치하지 않습니다.')
          setCodeCss('flex items-center pt-1 text-sm text-red-500')
          setCodeColor('failure')
        }
        if (res.status === 'success') {
          setCodeText('인증이 완료되었습니다.')
          setCodeCss('flex items-center pt-1 text-sm text-green-500')
          setEmailState('verified')
          setCodeColor('success')
        }
      })
  }

  const checkEmail = async () => {
    setLoading(true)
    setEmailError('')
    setEmailStatus('')
    try {
      const response = await fetchExtended('/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (data.message === '사용 가능한 이메일입니다.') {
        setEmailVerified(true)
        setEmailDupleText(data.message)
        setEmailDupleCss('flex items-center pt-1 text-sm text-green-500')
        setEmailColor('success')
      } else {
        setEmailDupleText(data.message)
        setEmailDupleCss('flex items-center pt-1 text-sm text-red-500')
        setEmailColor('failure')
      }
    } catch (error) {
      setEmailDupleText(error.message)
      setEmailDupleCss('flex items-center pt-1 text-sm text-red-500')
      setEmailColor('failure')
    } finally {
      setLoading(false)
    }
  }

  const sendVerifyCode = () => {
    if (!emailVerified) {
      handleAlert('failure', '이메일 중복확인을 해주세요.')
      return
    } else {
      const sendVerifyCodeReqUrl = new URL(apiUrl + `/request-verification-user`)

      fetchExtended(sendVerifyCodeReqUrl, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 'fail') {
            handleAlert('failure', res['message'])
          }
          if (res.status === 'success') {
            handleAlert('success', '인증번호가 발송되었습니다.')
            setSendBtn(true)
          }
        })
    }
  }

  const handlePassword = (value) => {
    setPassword(value)
    if (value.length < 8) {
      setPasswordError('비밀번호는 8~12자리의 영문,숫자 조합이어야 합니다.')
      setPWColor('failure')
    } else {
      setPasswordError('')
      setPWColor('gray')
    }
  }

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value)
    if (value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
      setConfirmPWColor('failure')
    } else {
      setConfirmPasswordError('')
      setConfirmPWColor('gray')
    }
  }

  return (
    <div>
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <section className="grid min-h-screen  items-center justify-center  ">
        <div
          className=" flex w-full
       flex-col items-center justify-center py-24 "
        >
          {' '}
          <div>
            <div className="grid  pb-10 text-center">
              <span className="pb-1 text-gray-500">딜리셔스 아이디어</span>
              <WebLogo />
            </div>
          </div>
          <form className="w-screen px-10">
            <div className="pb-2">
              <Label htmlFor="name">이름</Label>
              <TextInput
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                icon={HiUser}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="pb-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex gap-1">
                <TextInput
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  icon={HiMail}
                  required
                  color={emailColor}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  color={'warning'}
                  onClick={checkEmail}
                  disabled={loading || !email || emailError}
                  className="shrink-0 rounded-lg bg-amber-400 px-0 text-center text-sm font-extrabold text-white hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  확인
                </Button>
              </div>
              <span className={emailDupleCss}>{emailDupleText}</span>
            </div>
            <div className="pb-2">
              <Label htmlFor="verificationCode">인증 코드</Label>
              <div className="flex gap-1">
                <TextInput
                  id="verificationCode"
                  type="text"
                  placeholder="인증 코드를 입력하세요"
                  icon={HiKey}
                  required
                  color={codeColor}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                {sendBtn ? (
                  <Button
                    color={'warning'}
                    onClick={() => handleVerifyCode()}
                    className=" shrink-0 bg-amber-400 px-0 text-center text-xs font-extrabold text-white hover:bg-amber-500 focus:outline-none focus:ring-4"
                  >
                    인증
                  </Button>
                ) : (
                  <Button
                    color={'warning'}
                    onClick={() => sendVerifyCode()}
                    className=" shrink-0 bg-amber-400 px-0 text-center text-xs font-extrabold text-white hover:bg-amber-500 focus:outline-none focus:ring-4"
                  >
                    전송
                  </Button>
                )}
              </div>
            </div>
            <span className={codeCss}>{codeText}</span>
            <div className="pb-2">
              <Label htmlFor="password">비밀번호</Label>
              <TextInput
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                icon={HiLockClosed}
                required
                value={password}
                color={PWColor}
                helperText={passwordError}
                onChange={(e) => handlePassword(e.target.value)}
              />
            </div>
            <div className="pb-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <TextInput
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                icon={HiLockClosed}
                required
                value={confirmPassword}
                color={confirmPWColor}
                helperText={confirmPasswordError}
                onChange={(e) => handleConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <Checkbox
                color={'warning'}
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <Label htmlFor="agree" className="flex">
                개인정보 처리방침에 동의합니다. &nbsp;
              </Label>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center pb-24">
          <Button
            color={'warning'}
            onClick={() => handleSubmit()}
            type="submit"
            className="w-3/4 rounded-lg bg-amber-400 text-center text-sm font-extrabold text-white hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-primary-300"
          >
            회원가입
          </Button>
        </div>
      </section>
    </div>
  )
}
