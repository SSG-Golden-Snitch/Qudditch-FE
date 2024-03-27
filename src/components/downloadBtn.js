'use client'

import { apiUrl, fetchExtended } from '@/utils/fetchExtended'
import { AiOutlineDownload } from 'react-icons/ai'

export async function DownloadBtn(inputId) {
  const downloadUrl = apiUrl + `/api/store/stock/input/download/${inputId}`

  await fetchExtended(downloadUrl, {
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
        throw new Error(res['message'])
      } else {
        console.log(res)
      }
    })

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <AiOutlineDownload />
    </div>
  )
}
