'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { CustomTable } from '@/components/CustomTable'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination, Button, Modal } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { MdOutlineQrCodeScanner } from 'react-icons/md'
import BarcodeScanner from '@/components/BarcodeScanner'
import { BrowserQRCodeReader } from '@zxing/library'
import CustomLoading from '@/components/ui/CustomLoading'

export default function Input() {
  const [pagination, setPagination] = useState({
    paginationParam: {
      page: 1,
    },
    totalPageCount: 0,
    startPage: 0,
    endPage: 0,
    existPrev: false,
    existNext: false,
  })
  const [disposalItems, setDisposalItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [color, setColor] = useState('')
  const [message, setMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [result, setResult] = useState('')
  const codeReader = new BrowserQRCodeReader()

  const handleResult = (result) => {
    setResult(result)
    if (result === '') {
      handleAlert('failure', '유효하지 않은 바코드입니다.')
      setOpenModal(false)
      codeReader.reset()
      return
    } else {
      handleDisposal(result)
      setOpenModal(false)
      codeReader.reset()
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    codeRender.stopCountinousDecode()
    console.log('stop')
  }

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleDisposal = async (result) => {
    const disposalItemReqUrl = new URL(apiUrl + '/api/store/stock/dispose')
    await fetchExtended(disposalItemReqUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        productId: result,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          handleAlert('failure', res['message'])
        } else {
          handleAlert('success', res['message'])
          handlsDisposalItems()
        }
      })
      .catch((error) => {
        handleAlert('failure', error.message)
      })
  }

  const handlsDisposalItems = async (page = 1) => {
    setError(null)
    setIsLoading(true)

    const disposalReqUrl = new URL(apiUrl + `/api/store/stock/dispose?page=${page}`)

    await fetchExtended(disposalReqUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res['status'] === 'fail') {
          setError(res['message'])
          throw new Error(res['message'])
        } else {
          setDisposalItems(res['data'])
          setPagination(res['pagination'])
        }
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handlsDisposalItems()
  }, [])

  const handlePage = (page) => {
    setPagination({
      ...pagination,
      paginationParam: { ...pagination.paginationParam, page: page + 1 },
    })
    handlsDisposalItems(page)
  }

  if (isLoading) return <CustomLoading />
  return (
    <div className="flex h-screen flex-col bg-[#e4e4e4] px-10 py-10">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <div>
        <div className="flex justify-end pb-5 pr-3">
          <Button className="" color="gray" onClick={() => setOpenModal(true)}>
            <div className="flex items-center gap-2 text-center align-middle text-xs">
              폐기등록
              <MdOutlineQrCodeScanner />
            </div>
          </Button>
        </div>
        {error ? (
          <div className="flex flex-col items-center text-red-500">{error}</div>
        ) : (
          <>
            <CustomTable
              handleData={handlsDisposalItems}
              handleAlert={handleAlert}
              data={disposalItems}
              pagination={pagination}
              header={[
                { label: 'No', col_name: 'id' },
                { label: 'name', col_name: 'productName' },
                { label: 'position', col_name: 'positionId' },
                { label: 'quantity', col_name: 'qty' },
                { label: 'price', col_name: 'productPrice' },
                { label: 'expDate', col_name: 'expiredAt' },
              ]}
            />
            <div className="relative flex items-center justify-center pt-10">
              <Pagination
                currentPage={pagination.paginationParam.page}
                totalPages={pagination.totalPageCount}
                showIcons={true}
                onPageChange={(page) => handlePage(page)}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        show={openModal}
        size="md"
        onClose={() => {
          setOpenModal(false)
          codeReader.reset()
        }}
        dismissible
        popup
      >
        <Modal.Header></Modal.Header>
        <Modal.Body className="grid items-center justify-items-center ">
          <div className="pb-5 text-sm text-gray-500">폐기할 상품의 QR코드를 인식해주세요</div>
          <div className="">
            <BarcodeScanner
              handleResult={handleResult}
              handleCloseModal={handleCloseModal}
              render={codeReader}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
