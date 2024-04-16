import returnFetch from 'return-fetch'

export const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getUserToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token')
  }
}

export const fetchExtended = returnFetch({
  baseUrl: apiUrl,
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer ' + getUserToken(),
  },
  interceptors: {
    request: async (args) => {
      console.log('********* before sending request *********')
      console.log('url:', args[0].toString())
      console.log('requestInit:', args[1], '\n\n')
      args.at(1).credentials = 'include'
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
