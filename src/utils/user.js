import { fetchExtended } from './fetchExtended'

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
        throw new Error('디바이스 로그아웃 실패')
      }
    } catch (error) {
      deviceLogoutMsg = error.message
    }
  }
  return isSuccessDeviceLogout
}

export { logout }
