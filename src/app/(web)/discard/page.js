'use client'

import { CustomAlert } from '@/components/CustomAlert'
import { CustomTable } from '@/components/CustomTable'
import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { Pagination, Button, Modal } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { MdOutlineQrCodeScanner } from 'react-icons/md'

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

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleAlert = (type, message) => {
    setColor(type)
    setMessage(message)
  }

  const handleDisposal = () => {
    console.log('disposal')
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
        credentials: 'include',
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

  if (isLoading) return <div className="h-screen bg-gray-100 p-6 py-16 ">Loading...</div>

  return (
    <div className="flex h-screen flex-col bg-gray-100 px-10 py-10">
      {message && <CustomAlert type={color} message={message} handleDismiss={setMessage} />}

      <div className="flex flex-col items-center pt-10">
        <div className="pb-5">
          <Button color="gray" onClick={() => setOpenModal(true)}>
            <div className="flex items-center gap-2 text-center align-middle text-xs ">
              폐기등록
              <MdOutlineQrCodeScanner />
            </div>
          </Button>
        </div>
        {error ? (
          <div className="text-red-500">{error}</div>
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
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div>카메라 들어갈거임</div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
