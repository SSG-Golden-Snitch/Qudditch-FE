import { fetchExtended } from './fetchExtended'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const CheckLogin = () => {
  'use client'
  useEffect(() => {
    function getToken() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')

        if (!token) {
          window.location.href = '/mobile/login'
        }
      }
    }

    getToken()
  }, [])
}

const logout = () =>
  new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      resolve(!localStorage.getItem('token'))
    } else {
      reject(new Error('No window object'))
    }
  })

async function logoutDevice() {
  let isSuccessDeviceLogout = false

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const base64Payload = token?.split('.')[1]
    const base64 = base64Payload?.replace(/-/g, '+')?.replace(/_/g, '/')
    const decodedJWT = JSON.parse(
      decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(''),
      ),
    )
    let userEmail = decodedJWT.sub
    const endpoint = '/api/fcm/logout-device'

    try {
      const response = await fetchExtended(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          email: userEmail,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // SUCCESS
        isSuccessDeviceLogout = true
      } else {
        new Error('디바이스 로그아웃 실패')
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return isSuccessDeviceLogout
}

export { CheckLogin, logout, logoutDevice }
