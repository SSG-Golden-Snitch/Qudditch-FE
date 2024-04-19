import returnFetch from 'return-fetch'

export const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getUserToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
}

export const fetchExtended = returnFetch({
  baseUrl: apiUrl,
  headers: {
    Authorization: `Bearer ${getUserToken()?.replaceAll('"', '')}`,
  },
  interceptors: {
    request: async (args) => {
      console.log('********* before sending request *********')
      console.log('url:', args[0].toString())
      console.log('requestInit:', args[1], '\n\n')
      const contentType = args[1].headers.get('Content-Type')
      if (
        contentType === 'text/plain;charset=UTF-8' ||
        (contentType === null && !(args[1].body instanceof FormData))
      ) {
        args[1].headers.set('Content-Type', 'application/json')
      }
      if (args[0].pathname in ['/login', '/register']) {
        console.log('login request')
        args[1].headers.delete('authorization')
      }
      return args
    },

    response: async (response, requestArgs) => {
      console.log('********* after receiving response *********')
      console.log('url:', requestArgs[0].toString())
      console.log('requestInit:', requestArgs[1], '\n\n')
      return response
    },
  },
})
