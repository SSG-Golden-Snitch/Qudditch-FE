'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import {
  Button,
  FileInput,
  Label,
  Modal,
  Pagination,
  Table,
  TextInput,
  Spinner,
  Checkbox,
} from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  HiLockClosed,
  HiMail,
  HiOutlineCheckCircle,
  HiOutlinePaperClip,
  HiUser,
} from 'react-icons/hi'
import { HiBuildingStorefront } from 'react-icons/hi2'
import WebLogo from '/public/WebLogo.svg'
import PrivacyModal from '@/components/PrivacyModal'

function Component() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [keyword, setKeyword] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [name, setName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [store, setStore] = useState('')
  const [storeName, setStoreName] = useState('')
  const [verify, setVerify] = useState(false)
  const [timer, setTimer] = useState(180)
  const [code, setCode] = useState('')
  const [permitEmail, setPermitEmail] = useState(false)
  const [text, setText] = useState('')
  const [emailColor, setEmailColor] = useState('gray')
  const [stores, setStores] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false)
  const [emailCss, setEmailCss] = useState('')
  const [loadEmail, setLoadEmail] = useState(false)

  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('')
  const [agree, setAgree] = useState(false)

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page },
    })
    handleStore(page)
  }

  const handleOpenPrivacyModal = () => {
    setOpenPrivacyModal(true)
  }

  const [pagination, setPagination] = useState({
    paginationParam: {
      page: 1,
      keyword: "''",
    },
    totalPageCount: 0,
    startPage: 0,
    endPage: 0,
    existPrev: false,
    existNext: false,
  })

  const handleStoreSelect = (id, name) => {
    setStore(id)
    setStoreName(name)
    setIsModalOpen(false)
  }

  const handleStore = async (page = 1, keyword = '') => {
    setError(null)

    const storeReqUrl = new URL(apiUrl + `/api/userstore/search?page=${page}&name=${keyword}`)
    await fetchExtended(storeReqUrl, {
      method: 'GET',

      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          console.log(res)
          throw new Error(res['message'])
        } else {
          console.log(res)
          setStores(res['data'])
          setPagination(res['pagination'])
          console.log(pagination)
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleOCRUpload = (e) => {
    setIsLoading(true)
    const file = e.target.files[0]
    const ocrReqUrl = new URL(apiUrl + `/business-number`)

    const formData = new FormData()
    formData.append('file', file)

    fetchExtended(ocrReqUrl, {
      method: 'POST',
      body: formData,
      'content-type': 'multipart/form-data',
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setBusinessRegistrationNumber(res['businessNumber'])
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const sendVerifyCode = () => {
    const sendVerifyCodeReqUrl = new URL(apiUrl + `/request-verification-store`)

    fetchExtended(sendVerifyCodeReqUrl, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {},
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          handleAlert('failure', res['message'])
        } else {
          handleAlert('success', '인증번호가 발송되었습니다.')
          setVerify(true)
          const interval = setInterval(() => {
            setTimer((prev) => prev - 1)
          }, 1000)
          setTimeout(() => {
            clearInterval(interval)
            setTimer(180)
            setVerify(false)
          }, 180000)
        }
      })
  }

  const loginRef = useRef()
  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('name', name)
    formData.append('storeId', store)
    formData.append('businessNumber', businessRegistrationNumber)

    fetchExtended('/register/store', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          handleAlert('failure', res['message'])
        } else {
          alert('회원가입이 완료되었습니다.')
          router.push(`/login`)
        }
      })
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    handleStore()
  }

  const [inputStates, setInputStates] = useState({
    passwordColor: 'gray',
    repeatPasswordColor: 'gray',
  })

  const handlePassword = (value) => {
    setPassword(value)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/
    setInputStates((prevState) => ({
      ...prevState,
      passwordColor: passwordRegex.test(value) ? 'gray' : 'failure',
    }))
  }

  const handleRepeatPassword = (value) => {
    setRepeatPassword(value)
    setInputStates((prevState) => ({
      ...prevState,
      repeatPasswordColor: password === value ? 'gray' : 'failure',
    }))
  }

  const timerFormat = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  const handleConfirmVerify = () => {
    const confirmVerifyReqUrl = new URL(apiUrl + `/verify-store`)
    const data = {
      email: email,
      code: code,
    }

    fetchExtended(confirmVerifyReqUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          handleAlert('failure', res['message'])
        } else {
          handleAlert('success', '이메일 인증이 완료되었습니다')
          setVerify(false)
          setPermitEmail(true)
          setEmailColor('success')
          setText('인증이 완료되었습니다.')
        }
      })
  }

  const handleEmailDuple = () => {
    setLoadEmail(true)
    const emailDupleReqUrl = new URL(apiUrl + `/find-store-email`)
    fetchExtended(emailDupleReqUrl, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          setEmailColor('failure')
          setText('이미 사용중인 이메일입니다')
          setEmailCss('flex items-center pt-1 text-sm text-red-500')
        } else {
          setEmailColor('success')
          setText('사용가능한 이메일입니다')
          setEmailCss('flex items-center pt-1 text-sm text-green-500')
        }
      })
      .finally(() => {
        setLoadEmail(false)
      })
  }

  return (
    <div className="h-full">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}
      <div className="grid  items-center justify-items-center pb-5 pt-20 text-center">
        <span className="pb-2 text-gray-500">딜리셔스 아이디어</span>
        <WebLogo />
      </div>
      <div className="flex flex-col items-center justify-center   pt-10">
        <div className="flex  items-center justify-center ">
          <form className="  flex w-full max-w-full flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="repeat-password">이름</Label>
              </div>
              <TextInput
                id="name"
                placeholder="이름을 입력하세요"
                value={name}
                icon={HiUser}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="w-full">
                <div className="mb-2 block">
                  <Label htmlFor="store">이메일</Label>
                </div>
                <div className="flex  gap-4">
                  <TextInput
                    id="store"
                    type="email"
                    placeholder="yourmail@mail.com"
                    icon={HiMail}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-96"
                    color={emailColor}
                  />
                  <Button style={{ backgroundColor: '#FBBF24' }} onClick={() => handleEmailDuple()}>
                    {loadEmail ? <Spinner /> : '중복확인'}
                  </Button>
                  <Button style={{ backgroundColor: '#FBBF24' }} onClick={() => sendVerifyCode()}>
                    인증번호 전송
                  </Button>
                </div>
                <div className={emailCss}>{text}</div>
              </div>
              {verify && (
                <div className="w-full">
                  <div className="mb-2 block"></div>
                  <div className="flex w-full gap-4">
                    <TextInput
                      id="store"
                      type="text"
                      placeholder="인증번호를 입력해주세요"
                      icon={HiOutlineCheckCircle}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-2/3"
                    />
                    <div className="flex content-center items-center gap-5 text-center">
                      <Button
                        style={{ backgroundColor: '#FBBF24' }}
                        onClick={() => handleConfirmVerify()}
                      >
                        인증번호 확인
                      </Button>
                      <div>{timerFormat(timer)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">비밀번호</Label>
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                icon={HiLockClosed}
                value={password}
                color={inputStates.passwordColor}
                onChange={(e) => handlePassword(e.target.value)}
                helperText={
                  inputStates.passwordColor === 'failure'
                    ? '비밀번호는 8~12자리의 숫자, 특수문자 조합이어야 합니다.'
                    : ''
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="repeat-password">비밀번호 확인</Label>
              </div>
              <TextInput
                id="repeat-password"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                icon={HiLockClosed}
                value={repeatPassword}
                onChange={(e) => handleRepeatPassword(e.target.value)}
                color={inputStates.repeatPasswordColor}
                helperText={
                  inputStates.repeatPasswordColor === 'failure'
                    ? '비밀번호가 일치하지 않습니다.'
                    : ''
                }
                required
              />
            </div>

            <div className="flex w-full ">
              <div className="pr-10">
                <div className="mb-2 block">
                  <Label htmlFor="store">매장 선택</Label>
                </div>
                <div className="flex gap-10">
                  <TextInput
                    id="store"
                    type="text"
                    placeholder="매장을 선택해주세요"
                    icon={HiBuildingStorefront}
                    value={storeName}
                    readOnly
                    className="w-96"
                  />
                  <Button style={{ backgroundColor: '#FBBF24' }} onClick={() => handleOpenModal()}>
                    매장 선택{' '}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="pr-10">
                <div className="mb-2 block">
                  <Label htmlFor="business-registration-number">사업자 등록 번호</Label>
                </div>
                <TextInput
                  id="business-registration-number"
                  type="text"
                  placeholder={isLoading ? '확인중입니다 ...' : '사업자 등록증을 첨부해주세요'}
                  icon={isLoading ? Spinner : HiOutlinePaperClip}
                  value={businessRegistrationNumber}
                  readOnly
                  className="w-96"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="ocr">사업자 등록증</Label>
                </div>
                <FileInput id="ocr" type="file" accept="image/*" onChange={handleOCRUpload} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-16">
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
                <PrivacyModal />
              </Label>
            </div>
          </form>
        </div>
        <Button
          style={{ backgroundColor: '#FBBF24' }}
          className="mb-10 mt-16 w-72"
          onClick={() => handleSubmit()}
        >
          회원가입
        </Button>

        <Modal size="4xl" show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <form className="mx-auto max-w-md">
                <label
                  htmlFor="default-search"
                  className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="매장 이름을 입력해주세요"
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                  />
                  <Button
                    style={{ backgroundColor: '#FBBF24' }}
                    className="absolute bottom-1.5 end-1.5 rounded-lg"
                    onClick={() => handleStore(pagination['page'], keyword)}
                  >
                    Search
                  </Button>
                </div>
              </form>
              <div>
                <Table className="text-center">
                  <Table.Head>
                    <Table.HeadCell>id</Table.HeadCell>
                    <Table.HeadCell>name</Table.HeadCell>
                    <Table.HeadCell>address</Table.HeadCell>
                    <Table.HeadCell></Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y text-center">
                    {stores.map((store) => (
                      <Table.Row key={store.id}>
                        <Table.Cell>{store.id}</Table.Cell>
                        <Table.Cell>{store.name}</Table.Cell>
                        <Table.Cell>{store.address}</Table.Cell>
                        <Table.Cell>
                          <Button
                            style={{ backgroundColor: '#FBBF24' }}
                            size="xs"
                            onClick={() => handleStoreSelect(store.id, store.name)}
                          >
                            선택
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <div className="relative flex items-center justify-center pt-10">
                  <Pagination
                    currentPage={pagination.paginationParam.page}
                    totalPages={pagination.totalPageCount}
                    showIcons={true}
                    onPageChange={(page) => handlePage(page)}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default Component
