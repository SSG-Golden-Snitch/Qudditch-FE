const logout = () =>
  new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      resolve(!localStorage.getItem('token'))
    } else {
      reject(new Error('No window object'))
    }
  })

export { logout }
