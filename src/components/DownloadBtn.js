'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { Button } from 'flowbite-react'
import { HiDownload } from 'react-icons/hi'

export function DownloadBtn({ inputId, inputAt, handleAlert, handleData }) {
  const downloadUrl = `/api/store/stock/input/download/${inputId}`
  const handleDownload = () => {
    fetchExtended(downloadUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        credentials: 'include',
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if (data['status'] === 'fail') {
          handleAlert('failure', data['message'])
          return
        }

        const blob = await fetchExtended(downloadUrl).then((r) => r.blob())
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `입고내역서-${inputAt}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        handleAlert('success', '다운로드 되었습니다')
      })
      .catch((error) => {
        handleAlert('failure', '다운로드에 실패했습니다')
      })
      .finally(() => handleData())
  }

  return (
    <Button
      size="sm"
      color="gray"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      onClick={handleDownload}
    >
      <HiDownload />
    </Button>
  )
}
